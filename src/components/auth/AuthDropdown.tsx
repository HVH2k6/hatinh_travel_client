import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IUser } from "@/interfaces/IUser";
import ButtonLogout from "./ButonLogout";
interface AuthProps {
    auth: IUser;
  }
  
export function AuthDropdown({auth}: AuthProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <b>Xin chào, {auth.username}</b>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
    
        <ButtonLogout/>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
