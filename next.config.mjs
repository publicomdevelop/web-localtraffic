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
    ];
    return [
      ...moved.map(([source, destination]) => ({ source, destination, permanent: true })),
      // No legal pages yet: temporary until the new privacy and legal notice pages exist.
      { source: "/politica-privacidad", destination: "/contacto", permanent: false },
      { source: "/terminos-y-condiciones", destination: "/contacto", permanent: false },
    ];
  },
};

export default nextConfig;
