'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { IDistricts } from '@/interfaces/IAddress';

export default function MenuMobileHeader({ districts }: { districts: IDistricts[] }) {
  const [open, setOpen] = useState(false);

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

          <nav className="mt-4 space-y-2 text-sm">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-primary/10"
            >
              Trang chủ
            </Link>

            <Accordion type="multiple" className="px-1">
              <AccordionItem value="attractions" className="border-none">
                <AccordionTrigger className="rounded-lg px-3 py-2 hover:bg-primary/10">
                  Địa điểm du lịch
                </AccordionTrigger>
                <AccordionContent className="pl-3">
                  <div className="grid gap-1">
                    {districts.slice(0, 16).map((d) => (
                      <Link
                        key={d.codename}
                        href={`/dia-diem/${d.codename}`}
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-1.5 hover:bg-accent"
                      >
                        {d.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="specialties" className="border-none">
                <AccordionTrigger className="rounded-lg px-3 py-2 hover:bg-primary/10">
                  Đặc sản địa phương
                </AccordionTrigger>
                <AccordionContent className="pl-3">
                  <div className="grid gap-1">
                    {districts.slice(0, 16).map((d) => (
                      <Link
                        key={d.codename}
                        href={`/dac-san/${d.codename}`}
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-1.5 hover:bg-accent"
                      >
                        {d.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link
              href="/kham-pha-cho"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-primary/10"
            >
              Khám phá chợ
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
