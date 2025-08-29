'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Menu } from 'lucide-react';
import { useState, Fragment } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { IDistricts } from '@/interfaces/IAddress';

export default function MenuMobileHeader({ districts }: { districts: IDistricts[] }) {
  const [open, setOpen] = useState(false);

  // Reusable section for districts
  const DistrictSection = ({
    title,
    prefix,
  }: {
    title: string;
    prefix: 'dia-diem' | 'dac-san';
  }) => (
    <AccordionItem value={prefix}>
      <AccordionTrigger className="px-3 py-2 rounded-md text-left hover:no-underline hover:bg-accent">
        {title}
      </AccordionTrigger>
      <AccordionContent className="px-1 pt-1 pb-2">
        <div className="grid gap-1">
          {districts.map((d) => (
            <Link
              key={`${prefix}-${d.codename}`}
              href={`/${prefix}/${d.codename}`}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-1.5 hover:bg-accent"
            >
              {d.name}
            </Link>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-[320px]">
          <SheetHeader>
            <SheetTitle>Khám phá Hà Tĩnh</SheetTitle>
          </SheetHeader>

          {/* Scrollable area to avoid long content overflow */}
          <nav className="mt-4 text-sm max-h-[calc(100vh-110px)] overflow-y-auto pr-1 space-y-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 hover:bg-accent"
            >
              Trang chủ
            </Link>

            <Accordion type="multiple" className="space-y-2">
              <DistrictSection title="Địa điểm du lịch" prefix="dia-diem" />
              <DistrictSection title="Đặc sản địa phương" prefix="dac-san" />
            </Accordion>

            <Link
              href="/kham-pha-cho"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 hover:bg-accent"
            >
              Khám phá chợ
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
