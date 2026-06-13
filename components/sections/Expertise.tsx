"use client";
import { motion } from "motion/react";
const P=[{i:"🤖",t:"AI Integration",d:"Custom AI workflows and automation that multiply output."},{i:"🌐",t:"Web Development",d:"High-performance websites built with modern frameworks."},{i:"⚙️",t:"Systems Architecture",d:"Scalable backend systems and APIs that grow with you."},{i:"📈",t:"SEO & Growth",d:"Data-driven SEO that drives organic traffic."},{i:"📊",t:"Analytics",d:"Dashboards and insights for data-informed decisions."},{i:"🎯",t:"Digital Strategy",d:"End-to-end roadmaps aligned with business goals."}];
const S=["Next.js","React","TypeScript","Tailwind CSS","Node.js","Python","Supabase","PostgreSQL","Prisma","Vercel","OpenAI API","LangChain","Figma","Framer Motion","n8n","Make"];

export default function Expertise() {
  return (
    <section id="expertise" className="py-28 md:py-40 atmosphere">
      <div className="max-w-6xl mx-auto px-6 md:px-20">
        <motion.p className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-4" style={{color:"rgb(var(--highlight-rgb))"}} initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>06 — Expertise</motion.p>
        <motion.h2 className="font-outfit font-bold text-[clamp(1.8rem,4vw,3rem)] tracking-tightest mb-14" style={{color:"var(--text)"}} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>6 Pillars of Expertise</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {P.map((p,i)=>(
            <motion.div key={p.t} className="glass p-6 group" initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-40px"}} transition={{duration:0.5,delay:i*0.07}}>
              <div className="w-12 h-12 rounded-2xl glass-static flex items-center justify-center text-xl mb-4">{p.i}</div>
              <h3 className="font-outfit font-semibold text-base tracking-tight mb-2" style={{color:"var(--text)"}}>{p.t}</h3>
              <p className="font-outfit font-light text-sm leading-relaxed" style={{color:"var(--text-secondary)"}}>{p.d}</p>
            </motion.div>
          ))}
        </div>
        <motion.p className="font-outfit text-[10px] font-light tracking-[0.35em] uppercase mb-6" style={{color:"rgb(var(--highlight-rgb))"}} initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>Tech Stack</motion.p>
        <div className="flex flex-wrap gap-2">
          {S.map((t,i)=><motion.span key={t} className="glass-pill px-4 py-2 font-outfit text-[13px] font-light" style={{color:"var(--text-secondary)"}} initial={{opacity:0,scale:0.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:0.3,delay:i*0.02}}>{t}</motion.span>)}
        </div>
      </div>
    </section>
  );
}
