import { Box, Grid, Text } from "@chakra-ui/react";
import { FaDesktop } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type NodeMapProps = {
  n: number;
  setLogs: React.Dispatch<React.SetStateAction<string[]>>;
  logs: string[];
};

function NodeMap({ n, setLogs, logs }: NodeMapProps) {
  const [highlightedNodes, setHighlightedNodes] = useState<{ attacker: number; victim: number }[]>([]);
  const [attackGraphData, setAttackGraphData] = useState<{ time: string; attacks: number }[]>([]);
  const gridRef = useRef<HTMLDivElement>(null); // Reference for positioning

  useEffect(() => {
    if (logs.length === 0) return;

    const latestLog = logs[0]; // Get the most recent attack log
    const match = latestLog.match(/Node (\d+) → Node (\d+)/);

    if (match) {
      const attacker = parseInt(match[1]);
      const victim = parseInt(match[2]);

      // Highlight attacker & victim + Draw attack line
      setHighlightedNodes((prev) => [...prev, { attacker, victim }]);

      // Revert colors and remove the attack line after 3 seconds
      setTimeout(() => {
        setHighlightedNodes((prev) => prev.filter((entry) => entry.attacker !== attacker || entry.victim !== victim));
      }, 3000);

      // Update attack graph
      const currentTime = new Date();
      const minuteKey = `${currentTime.getHours()}:${currentTime.getMinutes()}`;

      setAttackGraphData((prev) => {
        const lastEntry = prev.length > 0 ? prev[prev.length - 1] : null;
        if (lastEntry && lastEntry.time === minuteKey) {
          return prev.map((entry) =>
            entry.time === minuteKey ? { ...entry, attacks: entry.attacks + 1 } : entry
          );
        } else {
          return [...prev, { time: minuteKey, attacks: 1 }].slice(-10);
        }
      });
    }
  }, [logs]);

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column" p={4}>
      {/* Node Grid */}
      <Box flex="1" overflowY="auto" p={4} borderRadius="md" position="relative" ref={gridRef}>
        <Grid templateColumns="repeat(auto-fit, minmax(100px, 1fr))" gap={4} position="relative">
          {Array.from({ length: n }, (_, index) => {
            const nodeId = index + 1;
            const isHighlighted = highlightedNodes.find((entry) => entry.attacker === nodeId || entry.victim === nodeId);
            const bgColor = isHighlighted
              ? nodeId === isHighlighted.attacker
                ? "red.700" // 🔴 Attacker during attack
                : "yellow.500" // 🟡 Victim during attack
              : "blue.600"; // 🔵 Default color

            return (
              <Box
                key={nodeId}
                position="relative"
                bg={bgColor}
                color="white"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                p={4}
                borderRadius="md"
                boxShadow="md"
                minWidth="100px"
                data-nodeid={nodeId} // Custom attribute for positioning
              >
                <FaDesktop size={32} />
                <Text mt={2}>Node {nodeId}</Text>
              </Box>
            );
          })}
        </Grid>

        {/* Attack Lines (Dotted) */}
        {highlightedNodes.map((line, index) => {
          const attackerNode = document.querySelector(`[data-nodeid="${line.attacker}"]`);
          const victimNode = document.querySelector(`[data-nodeid="${line.victim}"]`);

          if (!attackerNode || !victimNode || !gridRef.current) return null;

          const attackerRect = attackerNode.getBoundingClientRect();
          const victimRect = victimNode.getBoundingClientRect();
          const gridRect = gridRef.current.getBoundingClientRect();

          // Calculate line start and end points
          const x1 = attackerRect.left + attackerRect.width / 2 - gridRect.left;
          const y1 = attackerRect.top + attackerRect.height / 2 - gridRect.top;
          const x2 = victimRect.left + victimRect.width / 2 - gridRect.left;
          const y2 = victimRect.top + victimRect.height / 2 - gridRect.top;

          return (
            <svg key={index} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="red"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.8"
              >
                {/* Animation for attack line */}
                <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
              </line>
            </svg>
          );
        })}
      </Box>

      {/* Attack Graph */}
      <Box width="100%" height="200px" bg="blue.500" color="white" textAlign="center" p={3} borderRadius="md" mt={2} boxShadow="lg">
        <Text fontSize="lg" fontWeight="bold">Attacks Per Minute</Text>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={attackGraphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="white" />
            <YAxis stroke="white" label={{ value: "Attacks", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line type="monotone" dataKey="attacks" stroke="cyan" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default NodeMap;
