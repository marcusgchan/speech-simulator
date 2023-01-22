import dynamic from "next/dynamic";

const DynamicClient = dynamic(() => import("../components/VRClient"), {
  ssr: false,
});

export default function Vr() {
  return (
    <>
      <DynamicClient />
    </>
  );
}
