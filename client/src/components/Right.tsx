import { useState, useEffect } from "react";
import { Box, VStack, Text } from "@chakra-ui/react";

interface RightProps {
  logs: string[];
}

function Right({ logs }: RightProps) {
  const [mostAttackedVictim, setMostAttackedVictim] = useState<string>("N/A");
  const [mostFrequentAttacker, setMostFrequentAttacker] = useState<string>("N/A");
  const [mostCommonAttack, setMostCommonAttack] = useState<string>("N/A");

  const [victimCounts, setVictimCounts] = useState<Record<string, number>>({});
  const [attackerCounts, setAttackerCounts] = useState<Record<string, number>>({});
  const [attackTypeCounts, setAttackTypeCounts] = useState<Record<string, number>>({});

  const [healingTimes, setHealingTimes] = useState<Record<string, number>>({});
  const HEALING_DURATION = 30; 

  useEffect(() => {
    if (logs.length === 0) return;

    const latestLog = logs[0];
    const attackMatch = latestLog.match(/Attack: (\w+)/);
    const attackerMatch = latestLog.match(/Node (\d+) → Node (\d+)/);

    if (attackMatch) {
      const attackType = attackMatch[1];

      setAttackTypeCounts((prev) => {
        const updatedCounts = { ...prev };
        updatedCounts[attackType] = (updatedCounts[attackType] || 0) + 1;

        const sortedAttacks = Object.entries(updatedCounts).sort((a, b) => b[1] - a[1]);
        setMostCommonAttack(sortedAttacks.length > 0 ? sortedAttacks[0][0] : "N/A");

        return updatedCounts;
      });
    }

    if (attackerMatch) {
      const attackerNode = `Node ${attackerMatch[1]}`;
      const victimNode = `Node ${attackerMatch[2]}`;

      setAttackerCounts((prev) => {
        const updatedCounts = { ...prev };
        updatedCounts[attackerNode] = (updatedCounts[attackerNode] || 0) + 1;

        const sortedAttackers = Object.entries(updatedCounts).sort((a, b) => b[1] - a[1]);
        setMostFrequentAttacker(sortedAttackers.length > 0 ? sortedAttackers[0][0] : "N/A");

        return updatedCounts;
      });

      setVictimCounts((prev) => {
        const updatedCounts = { ...prev };
        updatedCounts[victimNode] = (updatedCounts[victimNode] || 0) + 1;

        const sortedVictims = Object.entries(updatedCounts).sort((a, b) => b[1] - a[1]);
        setMostAttackedVictim(sortedVictims.length > 0 ? sortedVictims[0][0] : "N/A");

        return updatedCounts;
      });

      setHealingTimes((prev) => ({
        ...prev,
        [victimNode]: HEALING_DURATION,
      }));
    }
  }, [logs]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealingTimes((prev) => {
        const updatedTimes = { ...prev };

        Object.keys(updatedTimes).forEach((node) => {
          if (updatedTimes[node] > 0) {
            updatedTimes[node] -= 1;
          } else {
            delete updatedTimes[node];
          }
        });

        return updatedTimes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      width="100%"
      bg="gray.900"
      color="white"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={4}
      height="100vh"
      boxShadow="md"
    >
      <VStack spacing={6} width="90%" flex={1}>
        {/* Attack Stats Box with Red Glow */}
        <Box
          width="100%"
          bg="gray.700"
          flex={1}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          borderRadius="md"
          boxShadow="0px 0px 15px rgb(11, 253, 245)" // Red Glow
          transition="box-shadow 0.3s ease-in-out"
        >
          <Text fontSize="lg" fontWeight="bold">Most Attacked Victim:</Text>
          <Text fontSize="xl" color="yellow.300">{mostAttackedVictim}</Text>

          <Text fontSize="lg" fontWeight="bold" mt={2}>Most Frequent Attacker:</Text>
          <Text fontSize="xl" color="red.300">{mostFrequentAttacker}</Text>

          <Text fontSize="lg" fontWeight="bold" mt={2}>Most Common Attack:</Text>
          <Text fontSize="xl" color="orange.300">{mostCommonAttack}</Text>
        </Box>

        {/* Countermeasures Box with Blue Glow */}
        <Box
          width="100%"
          bg="gray.700"
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
          boxShadow="0px 0px 15px rgb(0, 255, 247)" // Blue Glow
          transition="box-shadow 0.3s ease-in-out"
          p={4}
          flexDirection="column"
        >
          <Text fontSize="lg" fontWeight="bold">Countermeasures</Text>

          {/* Healing Times Display */}
          {Object.keys(healingTimes).length > 0 ? (
            <Box mt={4} p={3} bg="gray.700" borderRadius="md">
              <Text fontSize="md" fontWeight="bold">Healing Times:</Text>
              {Object.entries(healingTimes).map(([node, time]) => (
                <Text key={node} fontSize="lg" color="green.300">
                  {node}: {time}s remaining
                </Text>
              ))}
            </Box>
          ) : (
            <Text fontSize="md" color="gray.300" mt={2}>
              No nodes are healing.
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
}

export default Right;
