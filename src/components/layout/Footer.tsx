import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, MapPin, Phone, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container px-4 py-12 mx-auto md:px-6 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          
          {/* Cột 1: Giới thiệu */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">hatinhtravel.net</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chúng tôi cung cấp các giải pháp công nghệ tiên tiến, giúp doanh nghiệp của bạn bứt phá trong kỷ nguyên số với giao diện hiện đại và trải nghiệm người dùng tối ưu.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Liên Kết</h3>
            <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                Trang Chủ
              </Link>
              <Link href="/#" className="hover:text-primary transition-colors">
                Về Chúng Tôi
              </Link>
              <Link href="/#" className="hover:text-primary transition-colors">
                Dịch Vụ
              </Link>
              <Link href="/blog" className="hover:text-primary transition-colors">
                Tin Tức
              </Link>
              <Link href="/lien-he" className="hover:text-primary transition-colors">
                Liên Hệ
              </Link>
            </nav>
          </div>

          {/* Cột 3: Thông tin liên hệ */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Liên Hệ</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 shrink-0" />
                <span>Trường THPT Cẩm Bình, thôn Tân An, Xã Cẩm Bình, Tỉnh Hà Tĩnh</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 shrink-0" />
                <span>+84 90 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 shrink-0" />
                <span>contact@example.com</span>
              </div>
            </div>
          </div>

          {/* Cột 4: Đăng ký nhận tin */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Đăng Ký Nhận Tin</h3>
            <p className="text-sm text-muted-foreground">
              Nhận thông báo về các cập nhật mới nhất và ưu đãi đặc biệt.
            </p>
            <form className="flex flex-col gap-2 sm:flex-row">
              <Input 
                type="email" 
                placeholder="Nhập email của bạn" 
                className="bg-background" 
              />
              <Button type="submit">Đăng Ký</Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Phần Bottom & Credit */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 hatinhtravel.net. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Code by <span className="font-bold text-primary"><Link href={'https://t.me/devtheworld'}>devtheworld</Link></span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}