import {
  Hero,
  IchimatsuDivider,
  About,
  Ceremony,
  IncenseInfo,
  GuestbookForm,
} from "@/components";

export default function Home() {
  return (
    <>
      <Hero />
      <IchimatsuDivider />
      <About />
      <IchimatsuDivider />
      <Ceremony />
      <IncenseInfo />
      <IchimatsuDivider />
      <GuestbookForm />
    </>
  );
}
