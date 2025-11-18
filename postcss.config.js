import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
// Shadow DOM maneja el aislamiento, no se requiere prefixSelector

export default {
  plugins: [tailwindcss, autoprefixer],
}
