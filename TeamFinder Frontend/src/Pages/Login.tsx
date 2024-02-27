import { Flex, TextInput, PasswordInput, rem, Title } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import LogoSVG from "../assets/logo.svg";
import ButtonComponent from "../Components/ButtonComponent";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const LOGIN_URL = "/api/login";

const icon = (
  <IconLock style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
);
export default function LoginPage() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();

  const usernameRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrorMsg("");
  }, [user, password]);

  const HandleButtonLogged = async () => {
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ userName: user, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const accessToken = response?.data?.accessToken;
        const roles = response?.data?.roles;
        setAuth({ accessToken, roles });
        navigate("/HomePage/" + accessToken);
        setUser("");
        setPassword("");
      }
    } catch (error) {
      setErrorMsg("Invalid username or password");
      errRef.current?.focus();
    }
  };

  return (
    <>
      <Flex
        justify="center"
        align="center"
        wrap="wrap"
        direction="column"
        h="100vh"
        w="100vw"
      >
        <div className="md:border border-gray-200 md:p-12 rounded-xl">
          <p
            ref={errRef}
            className={errorMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errorMsg}
          </p>

          <Flex className="p-2 my-6 " gap="sm">
            <img src={LogoSVG} alt="Team Finder Logo" className="w-8" />

            <Title order={1} className="font-normal text-3xl">
              TeamFinder
            </Title>
          </Flex>

          <Flex miw="300" direction="column">
            <TextInput
              size="md"
              label="Username"
              placeholder="Username"
              ref={usernameRef}
              autoComplete="off"
              onChange={(e) => setUser(e.currentTarget.value)}
              value={user}
              required
            ></TextInput>
          </Flex>

          <Flex miw="300" direction="column">
            <PasswordInput
              size="md"
              label="Password"
              placeholder="Password"
              leftSection={icon}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            ></PasswordInput>
          </Flex>

          <Flex mt="30" align="center" gap="20">
            {!user || !password ? (
              <ButtonComponent
                buttonText="Log In"
                HandleButton={() => {
                  setErrorMsg("Please enter username and password");
                }}
              />
            ) : (
              <ButtonComponent
                buttonText="Log In"
                HandleButton={HandleButtonLogged}
              />
            )}
          </Flex>
          <Flex m="10" gap="sm">
            Don't have an account?
            <Link
              to="/register"
              className="font-normal text-indigo-500 hover:text-cyan-900"
            >
              Register
            </Link>
          </Flex>
        </div>
      </Flex>
    </>
  );
}
