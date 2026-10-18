import { NigelPromptTemplate } from '../types';

export const NIGEL_PROMPT_TEMPLATES: NigelPromptTemplate[] = [
  {
    id: 'tmpl-1',
    title: 'Automated VISA SCPI DMM Sweep with Limit Testing',
    hardware: 'Keysight 34461A DMM + Keysight E3631A DC Power Supply (USB / GPIB)',
    architecture: 'Standard State Machine with Typedef Enum',
    complexity: 'Standard',
    description: 'Ramps voltage on an external power supply, measures current with a precision DMM, compares against upper/lower tolerance limits, and logs telemetry to TDMS.',
    samplePrompt: `Design a National Instruments LabVIEW SubVI for an Automated Voltage Sweep and Limit Verification bench.
Target Hardware: Keysight E3631A Power Supply & Keysight 34461A DMM connected over NI-VISA (GPIB/USB).
Architecture: Certified LabVIEW Developer Standard State Machine using a Strict Typedef Enum for states: [Initialize, ConfigureLimits, ArmTrigger, ExecuteSweep, EvaluateLimits, LogTDMS, CleanUp].

Connector Pane Specification (4x2x2x4 standard):
- Top-Left: VISA Resource Name (Power Supply)
- Mid-Left: VISA Resource Name (DMM)
- Bottom-Left: Error In (Standard Error Cluster)
- Top-Right: Measured Data Array (Cluster of Timestamp, Voltage, Current, Pass/Fail Boolean)
- Bottom-Right: Error Out

Execution Rules:
1. Zero Local Variables; all state and data propagated through Shift Registers on the While Loop border.
2. Initialize and configure both VISA sessions once in Initialize state; never call VISA Open inside the sweep loop.
3. In ExecuteSweep, step voltage from 1.0V to 5.0V with 0.25V increments, with 50ms settle time per point.
4. Compare measured current against Upper Limit (500mA) and Lower Limit (50mA) using In Range and Coerce.vi.
5. Trap VISA Timeout Error -1073807339 (Hex 0xBFFF0015) and record in test diagnostics.
6. Write telemetry to a National Instruments TDMS file with Root Properties: SerialNumber, Operator, and Timestamp.`,
  },
  {
    id: 'tmpl-2',
    title: 'High-Speed DAQmx Continuous Streaming & FFT Peak Detector',
    hardware: 'NI PXIe-6363 Multifunction DAQ (Analog Input, Continuous Hardware Timing)',
    architecture: 'Producer-Consumer Architecture with NI FIFO Queue',
    complexity: 'Advanced',
    description: 'Continuous 100 kS/s analog voltage streaming decoupled into a high-speed DAQ acquisition loop and an asynchronous analysis/logging loop.',
    samplePrompt: `Architect a high-performance continuous vibration acquisition and spectral analysis application in National Instruments LabVIEW.
Target Hardware: NI PXIe-6363 DAQmx device (ai0 to ai3 channels).
Architecture: Producer-Consumer Design Pattern decoupled with an NI Queue of Waveform Clusters.

Producer Loop Specification:
- Configure DAQmx Timing for Sample Clock: 100,000 Hz Continuous Samples with 10,000 samples per channel per read.
- Loop iterates every 100ms; purely executes DAQmx Read (Analog 2D DBL NChan NSamp) and enqueues element into FIFO queue.
- Zero UI controls, zero charts, and zero disk writes in Producer loop to ensure continuous hardware FIFO throughput.

Consumer Loop Specification:
- Dequeue Element with a 250ms timeout; handle timeout gracefully without stopping unless Abort command received.
- Compute FFT Power Spectrum and Peak Frequency Detector on each channel.
- Update Front Panel Waveform Graph and stream raw samples to TDMS file asynchronously.
- Implement an error-safe shutdown sequence that flushes the queue, releases queue refnums, and stops the DAQmx task.`,
  },
  {
    id: 'tmpl-3',
    title: 'Automotive CAN Bus Telemetry & ECU Calibration Sequencer',
    hardware: 'NI-XNET PXIe-8510 2-Port CAN Interface',
    architecture: 'Queued Message Handler (QMH) with Event Structure',
    complexity: 'Enterprise ATE',
    description: 'Transmits diagnostic OBD-II / UDS requests, parses incoming DBC message frames, monitors engine RPM and coolant temperature, and alerts on DTC error codes.',
    samplePrompt: `Create an Automotive CAN Bus automated diagnostic and telemetry acquisition VI in LabVIEW.
Target Hardware: NI-XNET CAN Interface (can0 port, 500 kbps high-speed baud rate).
Architecture: Queued Message Handler (QMH) with an Event Structure handling User Interface commands and a Consumer Loop processing CAN frames.

Requirements:
1. Load CAN database (.DBC) and create an NI-XNET Signal Single-Point In session for engine parameters [Engine_RPM, Vehicle_Speed, Coolant_Temp, Throttle_Position].
2. Create an NI-XNET Frame Stream Out session to transmit UDS Diagnostic Session Control frame (0x7DF, 8 bytes).
3. Check for Diagnostic Trouble Codes (DTCs). If DTC detected, light Front Panel Warning LED and log error code to report.
4. Maintain Error Cluster integrity through all NI-XNET nodes and handle CAN Bus-Off error gracefully with automatic bus recovery.`,
  },
  {
    id: 'tmpl-4',
    title: 'Environmental Chamber Thermal Cycling Test Executive',
    hardware: 'Modbus TCP Environmental Chamber + Eurotherm Temperature Controller',
    architecture: 'Standard State Machine with State Pattern & Timer',
    complexity: 'Advanced',
    description: 'Automates a 24-hour thermal cycle (-40°C to +85°C soak profiles) with Modbus TCP communication, PID monitoring, and safety abort interlocks.',
    samplePrompt: `Generate an automated 24-hour environmental thermal chamber cycling VI in LabVIEW.
Communication Protocol: Modbus TCP over Ethernet (Holding Registers for Setpoint and Process Variable).
Architecture: State Machine with profile states: [RampToCold, SoakCold, RampToHot, SoakHot, ReturnToAmbient, EmergencyEStop].

Specifications:
- Read Holding Register 40001 (Chamber Temp) and Holding Register 40002 (Humidity %RH) every 1 second.
- Write Holding Register 40003 with Target Setpoint: Ramp at 2.0°C/minute rate limiter.
- If chamber temperature exceeds safety upper limit (+95°C) or thermal runaway is detected, immediately transition to EmergencyEStop, cut heater contactor, and trip audible alarm.
- Save complete temperature profiles with 1-second resolution into TDMS file with metadata.`,
  },
];
