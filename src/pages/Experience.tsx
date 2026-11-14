import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SEO from "@/components/SEO";
import DeskScene from "@/components/desk/DeskScene";
import PhoneFrame from "@/components/phone/PhoneFrame";
import LockScreen from "@/components/phone/LockScreen";
import ChatApp from "@/components/phone/ChatApp";

/**
 * The landing page: a phone on a desk. The lock screen shows one message from
 * Umer's agent; opening it turns the phone into the portfolio chat.
 * `?chat=1` skips straight to the chat. No three.js on this route.
 */
export default function Experience() {
  const [params] = useSearchParams();
  const [opened, setOpened] = useState(() => params.get("chat") === "1");
  // Only move focus after the visitor has acted, never on first load.
  const [interacted, setInteracted] = useState(false);
  const reduce = useReducedMotion() ?? false;

  const open = () => {
    setInteracted(true);
    setOpened(true);
  };
  const close = () => {
    setInteracted(true);
    setOpened(false);
  };

  const screen = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, scale: opened ? 0.94 : 1.04 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: opened ? 1.04 : 0.96 },
        transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <>
      <SEO
        title="Home"
        description="Umer Khan, full-stack developer and AI engineer. Open the message on the phone to chat with his portfolio agent, see his projects, or book a call."
      />
      <main id="main" className="relative">
        <DeskScene opened={opened}>
          <PhoneFrame buzzing={!opened}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={opened ? "chat" : "lock"} className="absolute inset-0" {...screen}>
                {opened ? (
                  <ChatApp onClose={close} autoFocus={interacted} />
                ) : (
                  <LockScreen onOpen={open} autoFocus={interacted} />
                )}
              </motion.div>
            </AnimatePresence>
          </PhoneFrame>
        </DeskScene>
      </main>
    </>
  );
}
