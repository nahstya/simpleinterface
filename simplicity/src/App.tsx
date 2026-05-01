/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Bell, 
  Settings, 
  ArrowLeft, 
  MoreVertical, 
  Plus, 
  Wifi, 
  Moon, 
  Wind, 
  Shield, 
  Lightbulb, 
  DoorClosed, 
  Thermometer,
  LayoutGrid,
  ChevronRight,
  User,
  Menu,
  MoreHorizontal
} from 'lucide-react';

// --- Types ---
type Screen = 
  | 'HOME' 
  | 'NOTIFICATIONS' 
  | 'SETTINGS' 
  | 'ROOM_DETAILS' 
  | 'BRIGHTNESS' 
  | 'DEVICES' 
  | 'SEARCH' 
  | 'CONFIGURATION' 
  | 'AUTOMATIONS' 
  | 'CONSTRUCTOR';

// --- Assets ---
const IMAGES = {
  LIVING_ROOM: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
  KITCHEN: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop",
  BEDROOM: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070&auto=format&fit=crop",
  SECURITY: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop",
  SPEAKER: "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=2000&auto=format&fit=crop",
  LIGHT_DETAIL: "https://images.unsplash.com/photo-1526308182272-d2fe5e5947d8?q=80&w=2070&auto=format&fit=crop",
  DOOR_DETAIL: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2070&auto=format&fit=crop",
  TEMP_DETAIL: "https://images.unsplash.com/photo-1518081461904-9d8f136351c2?q=80&w=2070&auto=format&fit=crop",
  ARCH: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
};

// --- Components ---

const BottomNav = ({ active, onChange }: { active: Screen; onChange: (s: Screen) => void }) => {
  const isNavigable = active === 'HOME' || active === 'NOTIFICATIONS' || active === 'SETTINGS';
  
  return (
    <nav className="absolute bottom-0 left-0 w-full z-50 flex justify-around items-center h-24 bg-surface/80 backdrop-blur-xl border-t border-outline-variant/20 px-8 pb-4">
      <button 
        onClick={() => onChange('HOME')}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${active === 'HOME' || active === 'ROOM_DETAILS' || active === 'BRIGHTNESS' ? 'text-primary scale-110' : 'text-outline/50 hover:text-outline'}`}
      >
        <Home size={22} fill={active === 'HOME' ? 'currentColor' : 'none'} />
        <span className="font-headline text-[9px] tracking-[0.2em] font-bold uppercase">Главная</span>
      </button>
      <button 
        onClick={() => onChange('NOTIFICATIONS')}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${active === 'NOTIFICATIONS' ? 'text-primary scale-110' : 'text-outline/50 hover:text-outline'}`}
      >
        <Bell size={22} fill={active === 'NOTIFICATIONS' ? 'currentColor' : 'none'} />
        <span className="font-headline text-[9px] tracking-[0.2em] font-bold uppercase">Уведомления</span>
      </button>
      <button 
        onClick={() => onChange('SETTINGS')}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${active === 'SETTINGS' || active === 'DEVICES' || active === 'SEARCH' || active === 'CONFIGURATION' || active === 'AUTOMATIONS' || active === 'CONSTRUCTOR' ? 'text-primary scale-110' : 'text-outline/50 hover:text-outline'}`}
      >
        <Settings size={22} fill={active === 'SETTINGS' ? 'currentColor' : 'none'} />
        <span className="font-headline text-[9px] tracking-[0.2em] font-bold uppercase">Настройки</span>
      </button>
    </nav>
  );
};

const Header = ({ title, left, right }: { title: string; left?: React.ReactNode; right?: React.ReactNode }) => (
  <header className="absolute top-0 left-0 w-full z-50 h-20 bg-surface flex items-center justify-between px-8 border-b border-surface-container-low">
    <div className="flex-1 flex justify-start">{left}</div>
    <h1 className="font-headline font-bold uppercase text-sm tracking-tighter text-center">{title}</h1>
    <div className="flex-1 flex justify-end">{right}</div>
  </header>
);

export default function App() {
  const [screen, setScreen] = useState<Screen>('HOME');
  const [brightness, setBrightness] = useState(40);
  const [isAwayMode, setIsAwayMode] = useState(false);
  const [automationsActive, setAutomationsActive] = useState([false, true, false, false]);
  const [expandedRooms, setExpandedRooms] = useState<string[]>(['LIVING']);
  const [openPermissions, setOpenPermissions] = useState<number | null>(null);

  const [selectedAutomation, setSelectedAutomation] = useState(0);

  const automations = [
    { 
      id: 0, 
      name: 'Умный ночной режим', 
      detail: 'Пресет 001', 
      desc: 'Свет в коридоре при движении ночью.',
      trigger: 'Коридор /\nДатчик',
      action: 'Ванная /\nСвет',
      triggerIcon: <Wifi size={48} />,
      actionIcon: <Lightbulb size={48} />
    },
    { 
      id: 1, 
      name: 'Режим Вечер', 
      detail: 'Пресет 002', 
      desc: 'Автоматический свет в гостиной в 18:00.',
      trigger: 'Таймер /\n18:00',
      action: 'Гостиная /\nСвет',
      triggerIcon: <Bell size={48} />,
      actionIcon: <Lightbulb size={48} />
    },
    { 
      id: 2, 
      name: 'Режим тишины', 
      detail: 'Пресет 003', 
      desc: 'Отключение всех звуковых уведомлений.',
      trigger: 'Активация /\nРучная',
      action: 'Система /\nБез звука',
      triggerIcon: <User size={48} />,
      actionIcon: <Bell size={48} className="opacity-40" />
    },
    { 
      id: 3, 
      name: 'Эко-режим', 
      detail: 'Пресет 004', 
      desc: 'Оптимизация потребления энергии.',
      trigger: 'Тариф /\nНочной',
      action: 'Приборы /\nЭкономия',
      triggerIcon: <Thermometer size={48} />,
      actionIcon: <Wind size={48} />
    }
  ];

  // Effects for auto-actions
  useEffect(() => {
    if (screen === 'SEARCH') {
      const timer = setTimeout(() => setScreen('CONFIGURATION'), 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const navigateTo = (next: Screen) => setScreen(next);

  const toggleRoom = (id: string) => {
    setExpandedRooms(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const renderScreen = () => {
    switch (screen) {
      case 'HOME':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 px-8 pb-40 max-w-2xl mx-auto">
            <Header 
              title="Дом" 
              left={<button className="p-2 text-primary opacity-80"><LayoutGrid size={20} /></button>}
              right={<button className="p-2 text-primary opacity-80"><User size={20} /></button>}
            />
              <div className="mb-24">
                <h2 className="font-headline text-4xl font-bold uppercase leading-[1.1] tracking-tight">
                  {isAwayMode ? 'Дом в режиме —' : 'Пространство —'}<br/>
                  {isAwayMode ? 'отсутствия' : 'это тишина'}
                </h2>
                <div className={`h-1 w-20 mt-6 ${isAwayMode ? 'bg-outline' : 'bg-primary'}`} />
                {isAwayMode && (
                  <div className="mt-8 flex items-center gap-3">
                    <Shield size={16} className="text-outline" />
                    <span className="text-[10px] font-headline font-bold tracking-[0.2em] uppercase text-outline">Безопасность: Активна</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-12">
                {[
                  { id: 'LIVING', name: 'Гостиная', desc: isAwayMode ? 'OFF' : '01 / Простор', img: IMAGES.LIVING_ROOM },
                  { id: 'KITCHEN', name: 'Кухня', desc: isAwayMode ? 'OFF' : '02 / Точность', img: IMAGES.KITCHEN },
                  { id: 'BEDROOM', name: 'Спальня', desc: isAwayMode ? 'OFF' : '03 / Покой', img: IMAGES.BEDROOM },
                  { id: 'SECURITY', name: 'Безопасность', desc: isAwayMode ? 'ARMED' : '04 / Защита', img: IMAGES.SECURITY }
                ].map((room) => (
                  <motion.div 
                    key={room.id}
                    onClick={() => !isAwayMode && room.id === 'LIVING' && navigateTo('ROOM_DETAILS')}
                    whileHover={!isAwayMode ? { scale: 1.02 } : {}}
                    className={`group cursor-pointer ${isAwayMode ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-surface-container-low mb-6">
                      <img src={room.img} alt={room.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-all duration-700" />
                      <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-300" />
                      {isAwayMode && (
                        <div className="absolute inset-0 border border-outline/20" />
                      )}
                    </div>
                    <h3 className="font-headline text-lg font-bold tracking-widest uppercase">{room.name}</h3>
                    <p className="text-[10px] text-outline tracking-widest uppercase mt-1 opacity-70">{room.desc}</p>
                  </motion.div>
                ))}
              </div>
            
            <div className="mt-32 mb-16 text-center">
              <p className="font-sans text-xs leading-relaxed text-outline/60 max-w-xs mx-auto italic">
                Мы верим в архитектуру, которая не диктует, а слушает. Каждый элемент здесь — это осознанный выбор.
              </p>
            </div>
          </motion.div>
        );

      case 'ROOM_DETAILS':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 px-8 pb-40 max-w-2xl mx-auto">
            <Header 
              title="Гостиная" 
              left={<button onClick={() => navigateTo('HOME')} className="p-2"><ArrowLeft size={20} /></button>}
              right={<button className="p-2"><MoreVertical size={20} /></button>}
            />
            <div className="grid grid-cols-1 gap-16 mt-12">
              {[
                { id: 'LIGHT', name: 'Свет', desc: '01 / Иллюминация', img: IMAGES.LIGHT_DETAIL, icon: <Lightbulb size={24} /> },
                { id: 'DOOR', name: 'Дверь', desc: '02 / Доступ', img: IMAGES.DOOR_DETAIL, icon: <DoorClosed size={24} /> },
                { id: 'THERM', name: 'Термостат', desc: '03 / Климат', img: IMAGES.TEMP_DETAIL, icon: <Thermometer size={24} /> }
              ].map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => item.id === 'LIGHT' && navigateTo('BRIGHTNESS')}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low mb-6">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/5" />
                    <div className="absolute top-8 right-8 text-primary opacity-80">{item.icon}</div>
                  </div>
                  <h3 className="font-headline text-xs font-bold tracking-[0.2em] uppercase">{item.name}</h3>
                  <p className="text-[10px] text-outline tracking-widest uppercase mt-1 opacity-70">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'BRIGHTNESS':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex flex-col items-center justify-center bg-surface overflow-hidden">
            <Header 
              title="" 
              left={<button onClick={() => navigateTo('ROOM_DETAILS')} className="p-2"><ArrowLeft size={20} /></button>}
            />
            
            <div className="relative flex flex-col items-center justify-center w-full h-full">
              {/* The Interaction Area (Hidden/Subtle) */}
              <div 
                className="absolute inset-0 z-20 cursor-ns-resize"
                onMouseMove={(e) => {
                  if (e.buttons === 1) { // Only on click-drag for more "physical" feel
                    const val = Math.round((1 - e.clientY / window.innerHeight) * 100);
                    setBrightness(val);
                  }
                }}
                onMouseDown={(e) => {
                  const val = Math.round((1 - e.clientY / window.innerHeight) * 100);
                  setBrightness(val);
                }}
              />

              {/* The Visual Representation - No feedback, just the icon reacting */}
              <div 
                className="relative flex flex-col items-center transition-all duration-300"
                style={{ opacity: 0.2 + (brightness / 100) * 0.8 }}
              >
                <div className="w-32 h-16 bg-primary mb-2 shadow-[0_0_40px_rgba(0,0,0,0.1)]" />
                <div className="w-[1px] h-48 bg-primary" />
                <div className="w-24 h-[1px] bg-primary" />
              </div>

              {/* A single, almost invisible line that moves with interaction */}
              <motion.div 
                animate={{ top: `${100 - brightness}%` }}
                className="absolute left-0 w-full h-[1px] bg-primary/5 pointer-events-none z-10"
              />
            </div>
          </motion.div>
        );

      case 'NOTIFICATIONS':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 px-8 pb-40 max-w-2xl mx-auto">
            <Header title="Уведомления" />
            <div className="mt-8">
              <span className="text-[10px] font-headline font-bold tracking-[0.3em] text-outline uppercase block mb-12">Сегодня</span>
              <div className="space-y-24">
                {[
                  { title: 'Включен свет', sub: 'Гостиная • Автоматически', time: '18:00' },
                  { title: 'Безопасность: Активно', sub: 'Периметр под охраной', time: '17:30' },
                  { title: 'Автоматизация выполнена', sub: 'Сценарий "Вечер" запущен', time: '16:45' }
                ].map((notif, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-outline-variant/10 pb-6">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-headline text-lg font-light tracking-wide uppercase">{notif.title}</h3>
                      <p className="text-[10px] text-outline tracking-wider uppercase">{notif.sub}</p>
                    </div>
                    <span className="font-headline text-[10px] opacity-40">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Visual Architectural Filler */}
            <div className="mt-48 flex justify-center">
              <div className="w-px h-24 bg-gradient-to-b from-outline-variant/30 to-transparent" />
            </div>
            <div className="mt-24 aspect-[21/9] bg-surface-container-low relative overflow-hidden flex items-center justify-center">
              <span className="font-headline text-[8px] tracking-[0.6em] text-outline/30 uppercase z-10">System Status: Nominal</span>
              <img src={IMAGES.ARCH} className="w-full h-full object-cover opacity-5 grayscale" />
            </div>
          </motion.div>
        );

      case 'SETTINGS':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 px-8 pb-40 max-w-2xl mx-auto">
            <Header title="Настройки" />
            <div className="space-y-12 mt-12">
              <div className="group flex items-center justify-between py-10 transition-colors hover:bg-surface-container-lowest px-4">
                <h2 className="font-headline text-2xl font-bold tracking-tighter uppercase">Режим "Я ушел"</h2>
                <div 
                  onClick={() => {
                    const nextVal = !isAwayMode;
                    setIsAwayMode(nextVal);
                    if (nextVal) navigateTo('HOME');
                  }}
                  className="relative w-16 h-8 bg-surface-container-highest cursor-pointer overflow-hidden border border-outline-variant/20"
                >
                  <motion.div 
                    animate={{ x: isAwayMode ? 32 : 0 }}
                    className="w-8 h-8 bg-black dark:bg-white"
                  />
                </div>
              </div>
              
              <div onClick={() => navigateTo('AUTOMATIONS')} className="group flex items-center justify-between py-10 transition-colors hover:bg-surface-container-lowest px-4 cursor-pointer">
                <h2 className="font-headline text-2xl font-bold tracking-tighter uppercase">Автоматизации</h2>
                <ChevronRight size={28} strokeWidth={1} />
              </div>
              
              <div onClick={() => navigateTo('DEVICES')} className="group flex items-center justify-between py-10 transition-colors hover:bg-surface-container-lowest px-4 cursor-pointer">
                <h2 className="font-headline text-2xl font-bold tracking-tighter uppercase">Мои устройства</h2>
                <ChevronRight size={28} strokeWidth={1} />
              </div>
            </div>
            
            <div className="mt-48">
              <div className="w-12 h-[1px] bg-outline-variant/30 mb-4" />
              <p className="text-[9px] tracking-[0.2em] uppercase opacity-40 font-headline">System Ver. 4.0.0_MONOLITH</p>
            </div>
          </motion.div>
        );

      case 'DEVICES':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 px-8 pb-40 max-w-2xl mx-auto">
            <Header 
              title="Мои устройства" 
              left={<button onClick={() => navigateTo('SETTINGS')} className="p-2"><ArrowLeft size={20} /></button>}
            />
            <div className="mt-12 space-y-16">
              {[
                { id: 'LIVING', name: 'Гостиная', devices: ['Умный свет', 'ТВ-центр', 'Климат-контроль'] },
                { id: 'KITCHEN', name: 'Кухня', devices: ['Холодильник', 'Посудомойка', 'Датчик дыма'] },
                { id: 'BEDROOM', name: 'Спальня', devices: ['Лампа для чтения', 'Шторы'] }
              ].map((room) => (
                <div key={room.id} className="border-b border-outline-variant/10 pb-8">
                  <div 
                    onClick={() => toggleRoom(room.id)}
                    className="flex justify-between items-center cursor-pointer group"
                  >
                    <h2 className="font-headline text-3xl font-light uppercase tracking-tight group-hover:text-primary/70 transition-colors">{room.name}</h2>
                    <motion.div animate={{ rotate: expandedRooms.includes(room.id) ? 180 : 0 }}>
                      <ChevronRight size={24} strokeWidth={1} />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {expandedRooms.includes(room.id) && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-8 pl-4 space-y-4">
                          {room.devices.map((device, i) => (
                            <div key={i} className="flex items-center gap-4 text-xs font-body tracking-wider uppercase opacity-60">
                              <div className="w-1 h-1 bg-primary" />
                              {device}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-24 space-y-8">
              <button 
                onClick={() => navigateTo('SEARCH')}
                className="w-full bg-primary text-white font-headline font-bold py-6 tracking-[0.3em] text-[10px] uppercase transition-transform active:scale-[0.98]"
              >
                Добавить устройство
              </button>
            </div>
          </motion.div>
        );

      case 'SEARCH':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex flex-col items-center justify-center p-8">
            <Header 
              title="Поиск" 
              left={<button onClick={() => navigateTo('DEVICES')} className="p-2"><ArrowLeft size={20} /></button>}
            />
            <div className="relative w-64 h-64 mb-16 flex items-center justify-center">
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                  className="absolute inset-0 border border-black/20"
                  style={{ margin: i * 20 }}
                />
              ))}
              <div className="w-16 h-16 border border-primary flex items-center justify-center bg-white shadow-xl">
                <div className="w-2 h-2 bg-primary" />
              </div>
              <div className="absolute top-0 right-0 w-8 h-[1px] bg-primary" />
              <div className="absolute bottom-0 left-0 w-8 h-[1px] bg-primary" />
            </div>
            <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-outline animate-pulse">Поиск устройств...</p>
          </motion.div>
        );

      case 'CONFIGURATION':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 px-8 pb-40 max-w-md mx-auto">
            <Header title="System Configuration" left={<button className="p-2"><Menu size={20} /></button>} />
            <div className="space-y-12">
              <div>
                <h1 className="font-headline text-4xl font-bold tracking-tighter uppercase mb-2">Умная колонка</h1>
                <p className="font-headline text-[10px] text-outline tracking-[0.2em] uppercase">Настройка устройства</p>
              </div>
              
              <div className="aspect-square bg-surface-container-low overflow-hidden">
                <img src={IMAGES.SPEAKER} className="w-full h-full object-cover grayscale contrast-125" />
              </div>
              
              <div className="space-y-6">
                {[
                  { name: 'Доступ к контактам', desc: 'Синхронизация списка контактов для быстрых звонков и сообщений.' },
                  { name: 'Доступ к аудиоданным', desc: 'Обработка голоса для выполнения команд и улучшения распознавания.' },
                  { name: 'Улучшение системы', desc: 'Анонимная статистика использования для оптимизации производительности.' }
                ].map((perm, i) => (
                  <div key={i} className="flex flex-col border-b border-surface-container py-2">
                    <div className="flex justify-between items-center group">
                      <span className="text-xs">{perm.name}</span>
                      <button 
                        onClick={() => setOpenPermissions(openPermissions === i ? null : i)}
                        className="p-1 hover:bg-surface-container rounded-full transition-colors"
                      >
                        <Plus size={16} className={`transition-transform duration-300 ${openPermissions === i ? 'rotate-45' : ''}`} />
                      </button>
                    </div>
                    <AnimatePresence>
                      {openPermissions === i && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-[10px] text-outline/80 font-sans italic leading-relaxed py-4 pr-8">
                            {perm.desc}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <button 
                  onClick={() => navigateTo('SETTINGS')}
                  className="w-full bg-primary text-white font-headline font-bold py-6 tracking-[0.3em] text-xs transition-transform active:scale-[0.98]"
                >
                  ПРИНЯТЬ ВСЁ
                </button>
                <p className="text-[10px] text-outline text-center mt-6 uppercase tracking-widest leading-relaxed opacity-50">
                  Нажимая кнопку, вы соглашаетесь с условиями обслуживания и политикой конфиденциальности.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 'AUTOMATIONS':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 px-8 pb-40 max-w-4xl mx-auto">
            <Header 
              title="Умные режимы" 
              left={<button onClick={() => navigateTo('SETTINGS')} className="p-2"><ArrowLeft size={20} /></button>}
              right={<button className="p-2"><MoreHorizontal size={20} /></button>}
            />
            <div className="mb-24">
              <h2 className="font-headline text-6xl font-bold uppercase tracking-[-0.04em] leading-[0.9]">Умные режимы</h2>
              <div className="h-[2px] w-24 bg-primary mt-8" />
            </div>
            
            <div className="space-y-24">
              {automations.map((preset) => (
                <div key={preset.id} className="group cursor-pointer">
                  <div className="flex justify-between items-end pb-8">
                    <div className="space-y-4" onClick={() => {
                        setSelectedAutomation(preset.id);
                        navigateTo('CONSTRUCTOR');
                      }}>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] tracking-[0.3em] text-outline uppercase font-headline opacity-60">{preset.detail}</span>
                        <h3 className="font-headline text-3xl font-light tracking-tight transition-colors group-hover:text-primary/70 uppercase">{preset.name}</h3>
                      </div>
                      <p className="text-[10px] text-outline/50 font-sans italic max-w-xs">{preset.desc}</p>
                    </div>
                    <div 
                      onClick={() => {
                        const next = [...automationsActive];
                        next[preset.id] = !next[preset.id];
                        setAutomationsActive(next);
                      }}
                      className={`w-14 h-8 bg-surface-container-high relative cursor-pointer border border-outline-variant/20`}
                    >
                      <motion.div 
                        animate={{ x: automationsActive[preset.id] ? 24 : 0 }}
                        className={`w-8 h-8 ${automationsActive[preset.id] ? 'bg-primary' : 'bg-outline-variant'}`}
                      />
                    </div>
                  </div>
                  <div className="h-[1px] w-full bg-outline-variant/10" />
                </div>
              ))}
            </div>
            
            <div className="absolute bottom-32 right-12 z-40 opacity-5 pointer-events-none">
              <span className="font-headline text-[12rem] font-black leading-none">X</span>
            </div>
          </motion.div>
        );

      case 'CONSTRUCTOR':
        const currentAuto = automations[selectedAutomation];
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 px-6 pb-40 w-full max-w-full overflow-x-hidden">
            <Header 
              title="Конструктор" 
              left={<button onClick={() => navigateTo('AUTOMATIONS')} className="p-2"><ArrowLeft size={20} /></button>}
              right={<button className="p-2"><MoreVertical size={20} /></button>}
            />
            <div className="mb-24">
              <h1 className="font-headline text-[min(14vw,4rem)] font-extrabold uppercase leading-[0.85] tracking-tighter whitespace-pre-line break-keep max-w-full">
                {currentAuto.name}
              </h1>
            </div>
            
            <div className="grid grid-cols-2 gap-0 w-full border-t border-b border-outline-variant">
  {/* Левая колонка (Триггер) */}
  <div className="flex flex-col p-6 border-r border-outline-variant min-w-0">
    <span className="text-[10px] tracking-[0.2em] uppercase text-secondary mb-8">Триггер</span>
    <div className="flex-1">
      <h3 className="text-xl leading-tight font-medium break-words">
        {currentAuto.trigger}
      </h3>
    </div>
    <div className="mt-4 opacity-20">{currentAuto.triggerIcon}</div>
  </div>

  {/* Правая колонка (Действие) */}
  <div className="flex flex-col p-6 min-w-0">
    <span className="text-[10px] tracking-[0.2em] uppercase text-secondary mb-8">Действие</span>
    <div className="flex-1">
      <h3 className="text-xl leading-tight font-medium break-words">
        {currentAuto.action}
      </h3>
    </div>
    <div className="mt-4 opacity-20">{currentAuto.actionIcon}</div>
  </div>
</div>
            
            <div className="mt-32 pt-12 border-t border-outline-variant/30 flex justify-between">
              <div>
                <span className="text-[9px] font-headline text-outline tracking-widest uppercase block mb-1">Статус</span>
                <span className="text-xs font-bold uppercase tracking-tight">
                  {automationsActive[selectedAutomation] ? 'Пресет активирован' : 'Пресет выключен'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-headline text-outline tracking-widest uppercase block mb-1">Серийный номер</span>
                <span className="text-xs font-light tracking-widest opacity-60">ID: 882-00-NX</span>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-surface selection:bg-primary selection:text-white relative overflow-hidden">
      {/* Контейнер для скролла */}
      <div className="h-full overflow-y-auto no-scrollbar pb-32">
        <AnimatePresence mode="wait">
          <motion.div 
            key={screen}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Навигация — за пределами скролла, чтобы всегда была снизу */}
      <BottomNav active={screen} onChange={navigateTo} />
    </div>
  );
}
