export const isDev = () => window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// export const getElementHeight = (el: HTMLElement | null): number => {
//     if(!el){
//         return 0;
//     }

//     let elHeight = el.offsetHeight;
    
//     ['margin-top', 'margin-bottom', 'padding-top', 'padding-bottom'].forEach(property => {
//         elHeight += parseInt(window.getComputedStyle(el).getPropertyValue(property));
//     });
    
//     return elHeight;
// };