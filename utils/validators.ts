/**
 * Utilidades de validación para formularios
 */

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validators = {
    /**
     * Valida que un campo no esté vacío
     */
    required: (value: any, fieldName: string = 'Este campo'): ValidationResult => {
        if (value === null || value === undefined || value === '') {
            return { isValid: false, error: `${fieldName} es obligatorio` };
        }
        return { isValid: true };
    },

    /**
     * Valida que un número sea positivo
     */
    positiveNumber: (value: number, fieldName: string = 'El valor'): ValidationResult => {
        if (isNaN(value) || value < 0) {
            return { isValid: false, error: `${fieldName} debe ser un número positivo` };
        }
        return { isValid: true };
    },

    /**
     * Valida que un número esté en un rango
     */
    numberInRange: (value: number, min: number, max: number, fieldName: string = 'El valor'): ValidationResult => {
        if (isNaN(value) || value < min || value > max) {
            return { isValid: false, error: `${fieldName} debe estar entre ${min} y ${max}` };
        }
        return { isValid: true };
    },

    /**
     * Valida que el valor de compra o venta sea mayor a 0 según el tipo de rubro
     */
    validateCompraVenta: (valorCompra: number, valorVenta: number, rubroType?: string): ValidationResult => {
        if (rubroType === 'compra' && valorCompra <= 0) {
            return { isValid: false, error: 'El valor de compra debe ser mayor a 0' };
        }
        if (rubroType === 'venta' && valorVenta <= 0) {
            return { isValid: false, error: 'El valor de venta debe ser mayor a 0' };
        }
        if (rubroType === 'both' && valorCompra <= 0 && valorVenta <= 0) {
            return { isValid: false, error: 'Al menos un valor (compra o venta) debe ser mayor a 0' };
        }
        return { isValid: true };
    },

    /**
     * Valida formato de AWB
     */
    awbFormat: (value: string): ValidationResult => {
        const awbPattern = /^\d{3}-\d{4}-\d{4}$/;
        if (!awbPattern.test(value)) {
            return { isValid: false, error: 'Formato de AWB inválido (formato: 123-4567-8901)' };
        }
        return { isValid: true };
    },

    /**
     * Valida formato de fecha
     */
    dateFormat: (value: string): ValidationResult => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return { isValid: false, error: 'Formato de fecha inválido' };
        }
        return { isValid: true };
    },

    /**
     * Valida peso (no puede ser negativo ni demasiado grande)
     */
    weight: (value: number): ValidationResult => {
        if (isNaN(value) || value <= 0) {
            return { isValid: false, error: 'El peso debe ser mayor a 0' };
        }
        if (value > 100000) {
            return { isValid: false, error: 'El peso parece demasiado alto. Verifique el valor.' };
        }
        return { isValid: true };
    },

    /**
     * Valida número de piezas
     */
    pieces: (value: number): ValidationResult => {
        if (!Number.isInteger(value) || value <= 0) {
            return { isValid: false, error: 'El número de piezas debe ser un entero positivo' };
        }
        if (value > 10000) {
            return { isValid: false, error: 'El número de piezas parece demasiado alto' };
        }
        return { isValid: true };
    },
};

/**
 * Función helper para mostrar errores
 */
export const showValidationError = (error: string): void => {
    // Aquí se puede integrar un sistema de notificaciones más sofisticado
    alert(error);
};

/**
 * Valida múltiples campos a la vez
 */
export const validateMultiple = (validations: ValidationResult[]): ValidationResult => {
    for (const validation of validations) {
        if (!validation.isValid) {
            return validation;
        }
    }
    return { isValid: true };
};
