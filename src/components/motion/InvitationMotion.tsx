"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { register, start, prefersReduced } from "@/lib/motion-controller";
import { registerHome } from "@/lib/motion/effects/home";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** SCR-09 / ENT-05: controller-owned, reversible entrance, 9 September 2026. */
export function InvitationMotion() {
  useGSAP(() => {
    let context: gsap.Context | undefined;
    const destroy = () => { context?.revert(); context = undefined; };
    const unregister = register({
      init() {
        destroy();
        const root = document.getElementById("invitation");
        if (!root || prefersReduced()) return;
        context = gsap.context(() => {
          registerHome();
          const animation = gsap.effects.homeInvitation(root);
          ScrollTrigger.create({ trigger: root, start: "top 95%",
            end: () => `+=${window.innerHeight * 0.65}`, scrub: 0.6,
            animation, invalidateOnRefresh: true });
        }, root);
      }, destroy,
    });
    start();
    return unregister;
  }, []);
  return null;
}
