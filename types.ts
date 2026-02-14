import { LucideIcon } from 'lucide-react';

export interface Family {
  parents: number[];
  partners: number[];
  children: number[];
}

export interface God {
  id: number;
  greekName: string;
  romanName: string;
  title: string;
  domain: string;
  symbol: string;
  symbolIcon: LucideIcon;
  animal: string;
  animalIcon: LucideIcon;
  icon: LucideIcon;
  image: string;
  color: string;
  desc: string;
  quote: string;
  family: Family;
  plathPoems?: string[];
}