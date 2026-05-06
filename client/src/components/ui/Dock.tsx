import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Home, Zap, Bot, Target, Users, TrendingUp, Building, FileText, Search, BarChart3 } from 'lucide-react';
import { Link } from 'wouter';

interface DockItemProps {
  children: React.ReactNode;
  mouseX: any;
  href?: string;
  onClick?: () => void;
}

function DockItem({ mouseX, children, href, onClick }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const content = (
    <motion.div
      ref={ref}
      style={{ width }}
      className="aspect-square w-10 rounded-full bg-gradient-to-t from-primary/80 to-primary flex items-center justify-center text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export function Dock() {
  const mouseX = useMotionValue(Infinity);

  const scrollToFeatures = () => {
    const featuresElement = document.getElementById('features');
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 mx-auto flex h-16 items-end gap-4 rounded-2xl bg-background/80 backdrop-blur-md px-4 pb-3 border border-border/50 shadow-2xl"
    >
      <DockItem mouseX={mouseX} href="/">
        <Home className="w-5 h-5" />
      </DockItem>
      <DockItem mouseX={mouseX} onClick={scrollToFeatures}>
        <Zap className="w-5 h-5" />
      </DockItem>
      <DockItem mouseX={mouseX} href="/rag">
        <Bot className="w-5 h-5" />
      </DockItem>
      <DockItem mouseX={mouseX} href="/local-investors">
        <Users className="w-5 h-5" />
      </DockItem>
      <DockItem mouseX={mouseX} href="/funding-policies">
        <FileText className="w-5 h-5" />
      </DockItem>
      <DockItem mouseX={mouseX} href="/pitch-deck-analyzer">
        <BarChart3 className="w-5 h-5" />
      </DockItem>
      <DockItem mouseX={mouseX} href="/competitive-analysis">
        <Search className="w-5 h-5" />
      </DockItem>
    </motion.div>
  );
}