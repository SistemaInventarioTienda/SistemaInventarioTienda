import { formatInTimeZone } from 'date-fns-tz';

export async function getDateCR() {
  try {
    // Define la zona horaria de Costa Rica
    const timeZone = 'America/Costa_Rica';
    return formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd HH:mm:ss');
  } catch (error) {
    console.error('Error al obtener la fecha:', error);
    throw error;
  }
}
