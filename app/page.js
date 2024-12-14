"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return(
    <div className="h-dvh w-dvw flex justify-center items-center">
    <FaSpinner className="animate-spin" size={"5rem"}/>
    </div>
  ); 
}