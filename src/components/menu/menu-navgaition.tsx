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
    children?: {
      title: string;
      url: string;
    }[];
  }
  
interface NavigationMenuDemoProps {
  menu: IMenu[];
}

export function NavigationMenuDemo({ menu }: NavigationMenuDemoProps) {
    return (
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {menu.map((item, index) => (
            <NavigationMenuItem key={index}>
              {item.isSubMenu ? (
                <>
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid grid-cols-2 gap-2 p-4 w-[450px]">
                      {item.children?.map((child, idx) => (
                        <li key={idx}>
                          <NavigationMenuLink asChild>
                            <Link href={child.url}>
                              <div className="text-sm font-medium leading-none">{child.title}</div>
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
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={item.url ?? '#'}>{item.title}</Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    )
  }
  