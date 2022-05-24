declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'element-ui/lib/locale/lang/*' {
  export const elementLocale: any
}

declare module '*.gif' {
  export const gif: any
}

// TODO: remove this part after vue-count-to has its typescript file
declare module 'vue-count-to'

// TODO: remove this part after vue2-dropzone has its typescript file
declare module 'vue2-dropzone'

// TODO: remove this part after vue-image-crop-upload has its typescript file
declare module 'vue-image-crop-upload'

declare module 'js-md5'

// declare module 'swiper'

// 我们在 typescript 的项目中安装一些包的话，可能会报错
// Could not find a declaration file for module 'xxx' ，
// 这是因为这个包可能不是.ts文件而是.js文件，那么如何解决呢
// 如果有这个包的 ts 版本，则
// npm install @types/xxx
// 否则，找到根目录下的 shims-vue-d.ts 文件
// declare module 'xxx'
