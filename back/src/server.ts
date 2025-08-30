import app from './app';
import { env } from './infrastructure/config/env';

const PORT = env.port;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    console.log(`Accede a http://localhost:${PORT}`);
});