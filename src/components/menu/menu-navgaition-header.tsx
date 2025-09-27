'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

interface IMenu {
  isSubMenu?: boolean;
  title: string;
  url?: string;
  children?: { title: string; url: string }[];
}

export function NavigationMenuHeader({ menu }: { menu: IMenu[] }) {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="gap-1">
        {menu.map((item, i) => (
          <NavigationMenuItem key={i}>
            {item.isSubMenu ? (
              <>
                <NavigationMenuTrigger
                  className="rounded-xl px-3 py-2 text-[15px] hover:bg-primary/10 transition-colors"
                >
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-2xl shadow-lg">
                  <ul className="grid w-[480px] grid-cols-2 gap-2 p-4">
                    {item.children?.map((c, idx) => (
                      <li key={idx}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={c.url}
                            className="block rounded-lg px-3 py-2 text-sm hover:bg-primary/10"
                          >
                            <span className="font-medium">{c.title}</span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle() + ' rounded-xl px-3 py-2 text-[15px] hover:bg-primary/10'}
              >
                <Link href={item.url ?? '#'}>{item.title}</Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
