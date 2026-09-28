/** @type {import('next').NextConfig} */
const nextConfig = {
  // URLs of the previous WordPress site (localtraffic.es until Sept. 2026), sent
  // to their closest page so links and search rankings are not lost.
  async redirects() {
    const moved = [
      ["/como-funciona", "/enfoque"],
      ["/geomarketing-publicidad", "/campanas"],
      ["/tienda", "/servicios"],
      ["/carrito", "/servicios"],
      ["/producto/:path*", "/servicios"],
      ["/categoria-producto/:path*", "/servicios"],
      ["/video", "/"],
      ["/377-2", "/"],
      ["/feed", "/"],
      ["/terminos-y-condiciones", "/aviso-legal"],
    ];
    // /politica-privacidad keeps its old URL, so it needs no redirect.
    return moved.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
