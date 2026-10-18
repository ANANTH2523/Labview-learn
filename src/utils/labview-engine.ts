import type { WireType } from '../types/index.ts';

/**
 * Checks if two LabVIEW wire data types are compatible.
 * In LabVIEW G-code:
 * - Identical types are always compatible.
 * - Numerics (i32, double) can coerce to double (produces a red Coercion Dot).
 * - Mismatched incompatible types (e.g., string into boolean) produce a Broken Wire.
 */
export function canConnectWire(sourceType: WireType, destType: WireType): { compatible: boolean; coerced: boolean; errorReason?: string } {
  if (sourceType === destType) {
    return { compatible: true, coerced: false };
  }

  // Coercion rules: integer to double is allowed with coercion
  if (sourceType === 'i32' && destType === 'double') {
    return { compatible: true, coerced: true };
  }

  // Any error cluster to error cluster
  if (sourceType === 'error' && destType === 'error') {
    return { compatible: true, coerced: false };
  }

  return {
    compatible: false,
    coerced: false,
    errorReason: `Type conflict: Cannot wire ${sourceType.toUpperCase()} output into ${destType.toUpperCase()} input terminal. Creates a broken wire (red dashed line).`,
  };
}

/**
 * Standard LabVIEW Wire Colors & Visual Specs
 */
export const WIRE_SPECS: Record<WireType, { color: string; strokeWidth: number; label: string; dash?: string }> = {
  double: { color: '#f97316', strokeWidth: 3, label: 'Double Precision Float (DBL)' }, // Orange
  i32: { color: '#2563eb', strokeWidth: 3, label: '32-bit Signed Integer (I32)' },     // Blue
  boolean: { color: '#16a34a', strokeWidth: 2, label: 'Boolean (TF)' },               // Green
  string: { color: '#db2777', strokeWidth: 3, label: 'String (ABC)' },                // Magenta / Pink
  cluster: { color: '#b45309', strokeWidth: 4, label: 'Cluster' },                    // Brown/Gold
  error: { color: '#ca8a04', strokeWidth: 4, label: 'Error Cluster', dash: '6 3' },   // Striped Yellow/Black
  waveform: { color: '#059669', strokeWidth: 4, label: 'Analog Waveform (WDT)' },     // Forest Green
};

/**
 * Computes a PID algorithm step (typical industrial LabVIEW PID VI)
 */
export interface PIDState {
  integralSum: number;
  prevError: number;
}

export function computePID(
  setpoint: number,
  processVariable: number,
  kp: number,
  ki: number,
  kd: number,
  dtSeconds: number,
  state: PIDState
): { output: number; updatedState: PIDState } {
  const error = setpoint - processVariable;
  const newIntegral = state.integralSum + error * dtSeconds;
  // Anti-windup clamping on integral
  const clampedIntegral = Math.max(-100, Math.min(100, newIntegral));
  const derivative = dtSeconds > 0 ? (error - state.prevError) / dtSeconds : 0;

  const rawOutput = kp * error + ki * clampedIntegral + kd * derivative;
  // Output limits (e.g. 0 to 100% actuator drive)
  const clampedOutput = Math.max(0, Math.min(100, rawOutput));

  return {
    output: Number(clampedOutput.toFixed(2)),
    updatedState: {
      integralSum: clampedIntegral,
      prevError: error,
    },
  };
}

/**
 * Computes moving average for sample arrays (LabVIEW Mean VI)
 */
export function computeMovingAverage(samples: number[], windowSize: number = 5): number {
  if (!samples || samples.length === 0) return 0;
  const slice = samples.slice(-windowSize);
  const sum = slice.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / slice.length).toFixed(2));
}

/**
 * Evaluates whether all required inputs for a G-node are populated
 * The fundamental G Dataflow rule: A node executes ONLY when all its inputs have valid tokens.
 */
export function isNodeReadyToExecute(
  requiredInputIds: string[],
  availableTerminalValues: Record<string, any>
): boolean {
  if (requiredInputIds.length === 0) return true;
  return requiredInputIds.every((id) => availableTerminalValues[id] !== undefined);
}

/**
 * LabVIEW Error Cluster merger
 * Propagates the first occurring error. If both are clear, returns status false.
 */
export interface LabVIEWError {
  status: boolean;
  code: number;
  source: string;
}

export function mergeErrors(errorIn1: LabVIEWError, errorIn2?: LabVIEWError): LabVIEWError {
  if (errorIn1.status) return errorIn1;
  if (errorIn2 && errorIn2.status) return errorIn2;
  return { status: false, code: 0, source: '' };
}
