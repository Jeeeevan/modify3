import { useState, useEffect } from 'react';
import { Box, VStack, IconButton, HStack, Text, Button } from '@chakra-ui/react';
import { FaHome, FaNetworkWired, FaCog, FaInfoCircle } from 'react-icons/fa';

interface LeftProps {
  logs: string[];
  attackersList: string[];
  victimsList: string[];
}

function Left({ logs, attackersList, victimsList }: LeftProps) {
  const [showBoxes, setShowBoxes] = useState([true, true, true]);
  const [sortMode, setSortMode] = useState<'attackType' | 'mostVictims'>('attackType');
  const [entityMode, setEntityMode] = useState<'attackers' | 'victims'>('attackers');
  const [victimCounts, setVictimCounts] = useState<Record<string, number>>({});
  const [attackTypeCounts, setAttackTypeCounts] = useState<Record<string, number>>({}); // ✅ Persistent attack type counts

  const toggleBox = (index: number) => {
    setShowBoxes(prev => prev.map((v, i) => (i === index ? !v : v)));
  };

  useEffect(() => {
    if (logs.length === 0) return;

    const latestLog = logs[0]; // Only process the latest log entry
    const attackMatch = latestLog.match(/Attack: (\w+)/);
    const victimMatch = latestLog.match(/→ Node (\d+)/);

    if (attackMatch) {
      const attackType = attackMatch[1];
      setAttackTypeCounts(prevCounts => ({
        ...prevCounts,
        [attackType]: (prevCounts[attackType] || 0) + 1, // ✅ Persist attack type counts
      }));
    }

    if (victimMatch) {
      const victimNode = `Node ${victimMatch[1]}`;
      setVictimCounts(prevCounts => ({
        ...prevCounts,
        [victimNode]: (prevCounts[victimNode] || 0) + 1,
      }));
    }
  }, [logs]); // Update only when new logs arrive

  // Sorting attack types by frequency
  const sortedAttackTypes = Object.entries(attackTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Sorting most attacked victims by count
  const sortedVictims = Object.entries(victimCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <Box
      width="100%"
      height="100vh"
      bg="gray.800"
      color="white"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="start"
      py={4}
      boxShadow="md"
      overflow="hidden"
    >
      {/* Top Row of Icon Buttons */}
      <HStack spacing={4} wrap="wrap" justify="center" width="100%">
        <IconButton aria-label="Home" icon={<FaHome />} variant="ghost" color="white" fontSize="24px" onClick={() => toggleBox(0)} />
        <IconButton aria-label="Network" icon={<FaNetworkWired />} variant="ghost" color="white" fontSize="24px" onClick={() => toggleBox(1)} />
        <IconButton aria-label="Settings" icon={<FaCog />} variant="ghost" color="white" fontSize="24px" onClick={() => toggleBox(2)} />
        <IconButton aria-label="Info" icon={<FaInfoCircle />} variant="ghost" color="white" fontSize="24px" />
      </HStack>

      {/* 3 Toggleable Boxes */}
      <VStack spacing={4} width="90%" flex={1} maxHeight="calc(100vh - 80px)" overflowY="auto">
        {/* Attack Logs Box */}
        {showBoxes[0] && (
          <Box width="100%" bg="gray.700" flex={1} p={4} borderRadius="md" overflowY="auto" maxHeight="33%">
            <Text fontSize="lg" fontWeight="bold">Attack Logs</Text>
            {logs.length === 0 ? (
              <Text fontSize="sm">No attacks yet</Text>
            ) : (
              logs.map((log, index) => (
                <Text key={index} fontSize="sm" wordBreak="break-word">
                  {log}
                </Text>
              ))
            )}
          </Box>
        )}

        {/* Sorting Box (By Attack Types & Most Attacked Nodes) */}
        {showBoxes[1] && (
          <Box width="100%" bg="gray.600" flex={1} p={4} borderRadius="md" maxHeight="33%" overflowY="auto">
            <VStack spacing={2} width="100%" mb={2}>
              <Button colorScheme="green" onClick={() => setSortMode('attackType')} width="100%">
                Freq Attacks
              </Button>
              <Button colorScheme="green" onClick={() => setSortMode('mostVictims')} width="100%">
                Most Attacked
              </Button>
            </VStack>

            {sortMode === 'attackType' ? (
              sortedAttackTypes.length > 0 ? (
                sortedAttackTypes.map(([attackType, count], index) => (
                  <Text key={index} fontSize="sm" wordBreak="break-word">
                    {attackType}: {count} times ⚔️
                  </Text>
                ))
              ) : (
                <Text fontSize="sm">No attacks recorded yet</Text>
              )
            ) : (
              sortedVictims.length > 0 ? (
                sortedVictims.map(([victim, count], index) => (
                  <Text key={index} fontSize="sm" wordBreak="break-word">
                    {victim}: {count} attacks 🔥
                  </Text>
                ))
              ) : (
                <Text fontSize="sm">No victims recorded yet</Text>
              )
            )}
          </Box>
        )}

        {/* Attackers & Victims Box */}
        {showBoxes[2] && (
          <Box width="100%" bg="gray.500" flex={1} p={4} borderRadius="md" maxHeight="33%" overflowY="auto">
            <VStack spacing={2} width="100%" mb={2}>
              <Button colorScheme="blue" onClick={() => setEntityMode('attackers')} width="100%">
                Attackers
              </Button>
              <Button colorScheme="blue" onClick={() => setEntityMode('victims')} width="100%">
                Victims
              </Button>
            </VStack>

            {entityMode === 'attackers' ? (
              attackersList.length === 0 ? (
                <Text fontSize="sm">No attackers yet</Text>
              ) : (
                attackersList.map((node, index) => (
                  <Text key={index} fontSize="sm" wordBreak="break-word">
                    {node}
                  </Text>
                ))
              )
            ) : (
              victimsList.length === 0 ? (
                <Text fontSize="sm">No victims yet</Text>
              ) : (
                victimsList.map((node, index) => (
                  <Text key={index} fontSize="sm" wordBreak="break-word">
                    {node}
                  </Text>
                ))
              )
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default Left;
