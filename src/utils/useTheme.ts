/**
 * 修改主题的hooks方法
 * */
const key = 'theme'
const theme = ref(localStorage.getItem(key)||'dark');

watchEffect(()=>{
    document.documentElement.dataset.theme = theme.value;
    localStorage.setItem(key,theme.value)
})

export function useTheme(){
    return {
        theme,
        toggleTheme(){
            theme.value = theme.value ==='light'?'dark':'light'
        }
    }
}