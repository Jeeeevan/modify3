import { Container, Stack, Box } from '@chakra-ui/react';
import Titlebar from './components/Titlebar';
import Left from './components/Left';
import Right from './components/Right';
import Nodemap from './components/Nodemap';
import { useState, useEffect } from 'react';

const attackTypes = ["DDoS", "Phishing", "Ransomware", "SQL Injection", "Malware", "Brute Force"];
const severityLevels = ["Low", "Medium", "High", "Critical"];

function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [attackersList, setAttackersList] = useState<number[]>([]);
  const [victimsList, setVictimsList] = useState<number[]>([]);
  const [attackData, setAttackData] = useState<{ time: string, count: number }[]>([]);
  const n = 21; // Number of nodes

  useEffect(() => {
    if (n < 2) return;

    let shuffledNodes = Array.from({ length: n }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    const splitIndex = Math.floor(n / 2);

    setAttackersList(shuffledNodes.slice(0, splitIndex)); // Store as numbers
    setVictimsList(shuffledNodes.slice(splitIndex)); // Store as numbers
  }, [n]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const generateAttack = () => {
      if (attackersList.length === 0 || victimsList.length === 0) return;

      const attacker = attackersList[Math.floor(Math.random() * attackersList.length)];
      const victim = victimsList[Math.floor(Math.random() * victimsList.length)];
      const attack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
      const timestamp = new Date().toLocaleTimeString();

      const logEntry = `[${timestamp}] Node ${attacker} → Node ${victim} | Attack: ${attack} | Severity: ${severity}`;

      setLogs(prevLogs => {
        let newLogs = [logEntry, ...prevLogs];

        if (newLogs.length > 15) {
          newLogs.pop();
        }

        return newLogs;
      });

      // ✅ Introduce a fluctuating attack count
      setAttackData(prevData => {
        let newCount = (prevData.length > 0 ? prevData[prevData.length - 1].count : 5) 
                      + Math.floor(Math.random() * 4) - 2; // Varies randomly up/down

        if (newCount < 1) newCount = 1; // Prevents going below 1
        if (newCount > 15) newCount = 15; // Prevents overly high values

        let newAttackData = [...prevData, { time: timestamp, count: newCount }];

        // Keep the graph within a rolling window
        if (newAttackData.length > 10) {
          newAttackData.shift();
        }

        return newAttackData;
      });

      const nextDelay = Math.floor(Math.random() * 4000) + 1000;
      timeoutId = setTimeout(generateAttack, nextDelay);
    };

    timeoutId = setTimeout(generateAttack, Math.floor(Math.random() * 4000) + 1000);

    return () => clearTimeout(timeoutId);
  }, [attackersList, victimsList]);

  return (
    <Stack height="100vh">
      <Titlebar />
      <Container maxW="100vw" display="flex" height="100%">
        <Box width="20%" bg="gray.900">
          <Left 
            logs={logs} 
            attackersList={attackersList.map(node => `Node ${node}`)} 
            victimsList={victimsList.map(node => `Node ${node}`)} 
          />
        </Box>
        <Box width="60%" bg="gray.700">
          <Nodemap 
            n={n} 
            setLogs={setLogs} 
            attackersList={attackersList}  
            victimsList={victimsList}  
            logs={logs}  
          />
        </Box>
        <Box width="20%" bg="gray.900">
          <Right logs={logs} />
        </Box>
      </Container>
    </Stack>
  );
}

export default App;
