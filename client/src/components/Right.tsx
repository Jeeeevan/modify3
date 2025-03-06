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

  useEffect(() => {
    if (logs.length === 0) return;

    const latestLog = logs[0];
    const attackMatch = latestLog.match(/Attack: (\w+)/);
    const attackerMatch = latestLog.match(/Node (\d+) → Node (\d+)/);

    if (attackMatch) {
      const attackType = attackMatch[1];
      setAttackTypeCounts(prev => {
        const updatedCounts = { ...prev, [attackType]: (prev[attackType] || 0) + 1 };
        const maxAttack = Object.entries(updatedCounts).sort((a, b) => b[1] - a[1])[0][0];
        setMostCommonAttack(maxAttack);
        return updatedCounts;
      });
    }

    if (attackerMatch) {
      const attackerNode = `Node ${attackerMatch[1]}`;
      const victimNode = `Node ${attackerMatch[2]}`;

      // Update attacker count
      setAttackerCounts(prev => {
        const updatedCounts = { ...prev, [attackerNode]: (prev[attackerNode] || 0) + 1 };
        const maxAttacker = Object.entries(updatedCounts).sort((a, b) => b[1] - a[1])[0][0];
        setMostFrequentAttacker(maxAttacker);
        return updatedCounts;
      });

      // Update victim count
      setVictimCounts(prev => {
        const updatedCounts = { ...prev, [victimNode]: (prev[victimNode] || 0) + 1 };
        const maxVictim = Object.entries(updatedCounts).sort((a, b) => b[1] - a[1])[0][0];
        setMostAttackedVictim(maxVictim);
        return updatedCounts;
      });
    }
  }, [logs]);

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
      {/* 2 Vertically Stacked Boxes */}
      <VStack spacing={4} width="90%" flex={1}>
        {/* Top Box - Attack Stats */}
        <Box
          width="100%"
          bg="blue.700"
          flex={1}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          borderRadius="md"
          boxShadow="md"
        >
          <Text fontSize="lg" fontWeight="bold">Most Attacked Victim:</Text>
          <Text fontSize="xl" color="yellow.300">{mostAttackedVictim}</Text>

          <Text fontSize="lg" fontWeight="bold" mt={2}>Most Frequent Attacker:</Text>
          <Text fontSize="xl" color="red.300">{mostFrequentAttacker}</Text>

          <Text fontSize="lg" fontWeight="bold" mt={2}>Most Common Attack:</Text>
          <Text fontSize="xl" color="orange.300">{mostCommonAttack}</Text>
        </Box>

        {/* Bottom Box - Countermeasures Heading */}
        <Box
          width="100%"
          bg="blue.500"
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
          boxShadow="md"
          p={4}
          flexDirection="column"
        >
          <Text fontSize="lg" fontWeight="bold">Countermeasures</Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default Right;
