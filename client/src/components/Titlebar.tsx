import { Box, Flex, Button, useColorModeValue, useColorMode, Text, Container } from "@chakra-ui/react";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";

export default function Navbar() {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Container maxW={"2500px"}>
			<Box bg={useColorModeValue("gray.400", "gray.700")} px={4} my={4} borderRadius={"5"}>
				<Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
					{/* LEFT SIDE */}
					<Flex justifyContent={"center"} alignItems={"center"} gap={3} display={{ base: "none", sm: "flex" }}>
						<img src='public/logo.png' alt='logo' width={50} height={50} />
					</Flex>

					{/* CENTER - GLOWING CYBER WATCHDOG TEXT */}
					<Text
						fontSize={"2xl"}
						fontWeight={"bold"}
						textAlign="center"
						color="white"
						textShadow="0 0 10px cyan, 0 0 20px cyan, 0 0 30px cyan" // Glowing effect
					>
						PirateShield
					</Text>

					{/* RIGHT SIDE - Toggle Color Mode */}
					<Button onClick={toggleColorMode}>
						{colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
					</Button>
				</Flex>
			</Box>
		</Container>
	);
}
