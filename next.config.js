// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   rewrites: async () => {
//     return [
//       {
//         source: '/api/:path*',
//         destination:
//           process.env.NODE_ENV === 'development'
//             ? 'http://127.0.0.1:5328/api/:path*'
//             : '/api',
//       },
//     ]
//   },
// }

// module.exports = nextConfig

const nextConfig = {
  rewrites: async () => {
    if (process.env.NODE_ENV === 'development') {
      // 仅在开发环境中使用重写规则
      return [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:5328/api/:path*',
        },
      ];
    }
    // 生产环境不需要重写规则
    return [];
  },
};

module.exports = nextConfig;
