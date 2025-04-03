import { useState, useEffect } from 'react';
import { Box, VStack, IconButton, HStack, Text, Button, Badge } from '@chakra-ui/react';
import { FaHome, FaNetworkWired, FaCog, FaShieldAlt, FaFileAlt, FaChartBar, FaUsers } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';

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
  const [attackTypeCounts, setAttackTypeCounts] = useState<Record<string, number>>({});
  const [attackRate, setAttackRate] = useState(0);
  const [lastMinuteLogs, setLastMinuteLogs] = useState<string[]>([]);

  const toggleBox = (index: number) => {
    setShowBoxes(prev => prev.map((v, i) => (i === index ? !v : v)));
  };

  useEffect(() => {
    if (logs.length === 0) return;

    const latestLog = logs[0];
    const attackMatch = latestLog.match(/Attack: (\w+)/);
    const victimMatch = latestLog.match(/→ Node (\d+)/);

    if (attackMatch) {
      const attackType = attackMatch[1];
      setAttackTypeCounts(prevCounts => ({
        ...prevCounts,
        [attackType]: (prevCounts[attackType] || 0) + 1,
      }));
    }

    if (victimMatch) {
      const victimNode = `Node ${victimMatch[1]}`;
      setVictimCounts(prevCounts => ({
        ...prevCounts,
        [victimNode]: (prevCounts[victimNode] || 0) + 1,
      }));
    }

    setLastMinuteLogs(prev => [...prev, latestLog]);
    setTimeout(() => {
      setLastMinuteLogs(prev => prev.slice(1));
    }, 60000);

    setAttackRate(lastMinuteLogs.length);
  }, [logs]);

  const sortedAttackTypes = Object.entries(attackTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const sortedVictims = Object.entries(victimCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Assigning color based on severity
  const getSeverityColor = (log: string) => {
    if (log.includes("Critical")) return "red.400";
    if (log.includes("High")) return "orange.400";
    if (log.includes("Medium")) return "yellow.300";
    return "green.300"; // Low severity
  };

  // Function to download attack logs as a text file
  const downloadAttackLogs = () => {
    if (logs.length === 0) {
      alert('No attack logs available to download.');
      return;
    }

    const logContent = logs.join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'attack_logs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" height="100vh" bg="gray.900" color="white" display="flex" flexDirection="column" alignItems="center" py={4}>
      <HStack spacing={4} wrap="wrap" justify="center" width="100%">
        <IconButton aria-label="Home" icon={<FaFileAlt />} variant="ghost" color="white" fontSize="24px" onClick={() => toggleBox(0)} />
        <IconButton aria-label="Network" icon={<FaChartBar />} variant="ghost" color="white" fontSize="24px" onClick={() => toggleBox(1)} />
        <IconButton aria-label="Settings" icon={<FaUsers />} variant="ghost" color="white" fontSize="24px" onClick={() => toggleBox(2)} />
        <IconButton aria-label="Download Attack Logs" icon={<FaDownload />} variant="ghost" color="white" fontSize="24px" onClick={downloadAttackLogs} />
      </HStack>

      <VStack spacing={7} width="90%" flex={1} maxHeight="calc(100vh - 80px)" overflowY="auto">
        {showBoxes[0] && (
          <Box width="100%" bg="gray.700" p={4} borderRadius="md" overflowY="auto" maxHeight="33%" boxShadow="0px 0px 20px rgba(79, 252, 255, 0.93)">
            <Text fontSize="lg" fontWeight="bold">Attack Logs</Text>
            {logs.length === 0 ? <Text fontSize="sm">No attacks yet</Text> : logs.map((log, index) => (
              <Text key={index} fontSize="sm" fontWeight="bold" color={getSeverityColor(log)}>
                {log} 
              </Text>
            ))}
          </Box>
        )}

        {showBoxes[1] && (
          <Box width="100%" bg="gray.600" p={4} borderRadius="md" maxHeight="33%" overflowY="auto" boxShadow="5px 5px 10px rgba(79, 252, 255, 0.93)">
            <HStack justify="space-between">
              <Button colorScheme="green" onClick={() => setSortMode('attackType')}>Freq Attacks</Button>
              <Button colorScheme="green" onClick={() => setSortMode('mostVictims')}>Most Attacked</Button>
            </HStack>
            <Text fontSize="sm" mt={2}> Attacks per minute: {attackRate}</Text>

            {sortMode === 'attackType' ? (
              sortedAttackTypes.length > 0 ? sortedAttackTypes.map(([attackType, count], index) => (
                <Text key={index} fontSize="sm">{attackType}: {count} times </Text>
              )) : <Text fontSize="sm">No attacks recorded yet</Text>
            ) : (
              sortedVictims.length > 0 ? sortedVictims.map(([victim, count], index) => (
                <Text key={index} fontSize="sm">{victim}: {count} attacks </Text>
              )) : <Text fontSize="sm">No victims recorded yet</Text>
            )}
          </Box>
        )}

        {showBoxes[2] && (
          <Box width="100%" bg="gray.500" p={4} borderRadius="md" maxHeight="33%" overflowY="auto" boxShadow="0px 0px 10px rgba(79, 252, 255, 0.93)">
            <HStack justify="space-between">
              <Button colorScheme="blue" onClick={() => setEntityMode('attackers')}>Attackers</Button>
              <Button colorScheme="blue" onClick={() => setEntityMode('victims')}>Victims</Button>
            </HStack>
            {entityMode === 'attackers' ? attackersList.map((node, index) => (
              <Text key={index}>{node}</Text>
            )) : victimsList.map((node, index) => (
              <Text key={index}>{node} <Badge colorScheme="green">Recovered</Badge></Text>
            ))}
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default Left;
