import { Modal, Button, TextField, FormControl } from "@mui/material";
import { useEffect, useState } from "react";
import useUser from "../hooks/useUser";

const Login = () => {
  // const router = useRouter();
  // const { user } = useUser();

  // const { session } = useSession();

  // const [showModal, setShowModal] = useState(false);

  // // useEffect(() => {
  // //   if (user) {
  // //     router.push("/");
  // //   }
  // // }, []);

  // const ModalComponent = () => {
  //   const [email, setEmail] = useState<string>("");
  //   const [password, setPassword] = useState<string>("");

  //   const handleSubmit = async (e: any) => {
  //     e.preventDefault();

  //     await login({ email, password });
  //   };
  //   return (
  //     <Modal
  //       open={showModal}
  //       onClose={() => setShowModal(false)}
  //       aria-labelledby="simple-modal-title"
  //       aria-describedby="simple-modal-description"
  //       className="grid place-items-center px-2"
  //     >
  //       <div
  //         className="flex justify-center flex-col w-full h-3/4
  //      sm:w-3/6 sm:h-60 bg-gray-100 rounded-xl outline-none px-4"
  //       >
  //         <p className="mb-4">Login</p>
  //         <form onSubmit={handleSubmit}>
  //           <FormControl className="rounded-md p-2 mb-3 w-full outline-none">
  //             <TextField
  //               onChange={(ev) => {
  //                 setEmail(ev.target.value);
  //               }}
  //               label="Email"
  //               variant="filled"
  //               type="email"
  //               required
  //             />
  //             <TextField
  //               onChange={(ev) => {
  //                 setPassword(ev.target.value);
  //               }}
  //               label="Password"
  //               variant="filled"
  //               type="password"
  //               required
  //             />
  //             {/* <input
  //           ref={docNameFieldRef}
  //           type="text"
  //           placeholder="Provide doc name"
  //           className="rounded-md p-2 mb-3 w-full outline-none"
  //         />*/}
  //           </FormControl>
  //           <div className="flex space-x-3 mt-7 justify-center">
  //             <Button onClick={() => setShowModal(false)}>Cancel</Button>
  //             <Button variant="contained" type="submit">
  //               Login
  //             </Button>
  //           </div>
  //         </form>
  //       </div>
  //     </Modal>
  //   );
  // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* <ModalComponent /> */}

      <div className="overflow-hidden w-40 h-auto mb-4">
        <img
          className="object-cover"
          src="https://www.pngkey.com/png/full/206-2061772_google-docs-icon-google-docs-logo-png.png"
          alt=""
        />
      </div>
      <button
        // onClick={() => signIn()}
        className="py-2 w-44 shadow-md hover:animate-pulse text-gray-100 rounded-md bg-[#2196f3]"
      >
        Sign In
      </button>
    </div>
  );
};

export default Login;
