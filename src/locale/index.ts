import {createI18n} from "vue-i18n";
import en from './en.ts'
import ja from './ja.ts'
import zh from './zh.ts'

const i18n = createI18n({
    locale:'ja',
    legacy:false,
    messages:{
        en:en,
        ja:ja,
        zh:zh
    }
})
export default i18n
