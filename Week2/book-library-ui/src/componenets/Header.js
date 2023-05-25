import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";

export default function Header() {
  const {
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    account,
    Moralis,
    deactivateWeb3,
  } = useMoralis();

  useEffect(() => {
    if (
      !isWeb3Enabled &&
      typeof window !== "undefined" &&
      window.localStorage.getItem("connected")
    ) {
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((newAccount) => {
      console.log(`Account changed to ${newAccount}`);
      if (newAccount == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null Account found");
      }
    });
  }, []);

  return (
    <header class="border-b md:flex md:items-center md:justify-between p-4 pb-0 shadow-lg md:pb-4">
      <div class="flex items-center justify-between mb-4 md:mb-0">
        <h1 class="leading-none text-2xl text-grey-darkest">
          <Link
            to="/"
            className="no-underline text-grey-darkest hover:text-black"
          >
            Book Library
          </Link>
        </h1>
      </div>

      <nav>
        <ul className="list-reset md:flex md:items-center">
          <li className="md:ml-4">
            <Link
              to="/add"
              className="block no-underline hover:underline py-2 text-grey-darkest hover:text-black md:border-none md:p-0"
            >
              Add Book
            </Link>
          </li>
          <li className="flex flex-row">
            {account ? (
              <div className="ml-auto py-2 px-4">
                Connected to {account.slice(0, 6)}...
                {account.slice(account.length - 4)}
              </div>
            ) : (
              <button
                onClick={async () => {
                  const ret = await enableWeb3();
                  if (typeof ret !== "undefined") {
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem("connected", "injected");
                    }
                  }
                }}
                disabled={isWeb3EnableLoading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
              >
                Connect
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
