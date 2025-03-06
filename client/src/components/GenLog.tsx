import { useState, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';

// List of possible attack types and severity levels
const attackTypes = [
  "DDoS", "SQL Injection", "Phishing", "Ransomware", "XSS", "Brute Force", "MITM Attack"
];
const severityLevels = ["Low", "Medium", "High", "Critical"];

interface GenLogProps {
  n: number; // Number of nodes
  updateLogs: (log: string) => void; // Function to update logs in Box 1
}

function GenLog({ n, updateLogs }: GenLogProps) {
  const [attackers, setAttackers] = useState<number[]>([]);
  const [victims, setVictims] = useState<number[]>([]);

  useEffect(() => {
    if (n < 2) return; // Ensure at least 2 nodes exist

    // Randomly shuffle nodes and divide into attackers and victims
    let shuffledNodes = Array.from({ length: n }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    const splitIndex = Math.floor(n / 2);

    setAttackers(shuffledNodes.slice(0, splitIndex));
    setVictims(shuffledNodes.slice(splitIndex));
  }, [n]);

  useEffect(() => {
    const generateLog = () => {
      if (attackers.length === 0 || victims.length === 0) return;

      const attacker = attackers[Math.floor(Math.random() * attackers.length)];
      const victim = victims[Math.floor(Math.random() * victims.length)];
      const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
      const timestamp = new Date().toLocaleTimeString();

      const logMessage = `[${timestamp}] Node ${attacker} → Node ${victim} | Attack: ${attackType} | Severity: ${severity}`;

      updateLogs(logMessage);
    };

    const interval = setInterval(generateLog, 1000); // 🔥 Faster attack generation (1 second)

    return () => clearInterval(interval);
  }, [attackers, victims, updateLogs]);

  return (
    <Box p={2} bg="gray.800" color="white" borderRadius="md">
      <Text fontSize="md">Logs Generating...</Text>
    </Box>
  );
}

export default GenLog;
