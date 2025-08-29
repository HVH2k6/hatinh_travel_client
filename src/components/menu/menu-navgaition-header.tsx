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
  
interface NavigationMenuHeaderProps {
  menu: IMenu[];
}

export function NavigationMenuHeader({ menu }: NavigationMenuHeaderProps) {
    return (
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {menu.map((item, index) => (
            <NavigationMenuItem key={index}>
              {item.isSubMenu ? (
                <>
                  <NavigationMenuTrigger className='hover:bg-green-400/35'>{item.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid grid-cols-2 gap-2 p-4 w-[450px]">
                      {item.children?.map((child, idx) => (
                        <li key={idx}>
                          <NavigationMenuLink asChild>
                            <Link href={child.url}    className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-green-400/35">
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
                  className={navigationMenuTriggerStyle() + ' hover:bg-green-400/35'}
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
  