import React from "react";
import { signIn, useSession } from "next-auth/client";

const Home = () => {
  const [session, loading] = useSession();

  const [providers, setAuthProviders] = React.useState<any>({});

  React.useEffect(() => {
    handleShowProviders();
  }, [session, loading]);

  const handleShowProviders = async () => {
    if (loading) return;
    const authProviders = await (await import("next-auth/client")).providers();
    setAuthProviders(authProviders);
  };

  return (
    <div>
      {session
        ? "Authenticated"
        : Object.values(providers).map(({ name, id }, index) => (
            <button key={index} onClick={() => signIn(id)}>
              {name}
            </button>
          ))}
    </div>
  );
};

export default Home;
