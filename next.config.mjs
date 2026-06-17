/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite carregar imagens de qualquer domínio externo (ex: links de imagem no products.json).
  // EDITAR AQUI: caso queira restringir a domínios específicos, troque por uma lista em "remotePatterns".
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
