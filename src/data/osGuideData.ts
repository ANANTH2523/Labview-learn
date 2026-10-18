export interface OSGuidePlatform {
  id: 'windows' | 'mac' | 'linux';
  name: string;
  badge: string;
  tagline: string;
  driverSupport: string;
  primaryUseCases: string[];
  installationGuide: {
    title: string;
    steps: string[];
    terminalCommands?: string[];
    pitfallWarning: string;
  };
  shortcuts: {
    action: string;
    keyCombo: string;
    description: string;
  }[];
  driverMatrix: {
    driver: string;
    status: 'Native Full Support' | 'Supported via LXI/Ethernet' | 'Requires Virtualization' | 'Kernel Module Required';
    notes: string;
  }[];
  expertTips: string[];
}

export const OS_GUIDES: Record<'windows' | 'mac' | 'linux', OSGuidePlatform> = {
  windows: {
    id: 'windows',
    name: 'Microsoft Windows (10 / 11 / Server)',
    badge: 'Tier 1 NI Flagship Target',
    tagline: 'Full hardware support: NI-DAQmx, PXIe, TestStand, FPGA, and CompactRIO',
    driverSupport: '100% Native support for all National Instruments hardware and software products.',
    primaryUseCases: [
      'Industrial Automated Test Equipment (ATE) production racks.',
      'High-speed PXIe chassis with multi-channel digitizers and arbitrary waveform generators.',
      'NI TestStand sequence execution and commercial manufacturing lines.',
      'LabVIEW FPGA module with Xilinx Vivado compilation server.',
    ],
    installationGuide: {
      title: 'Installing LabVIEW & NI Drivers on Windows',
      steps: [
        'Download and install NI Package Manager (NIPM) from ni.com.',
        'Select LabVIEW 32-bit (for legacy 32-bit instrument DLL compatibility) or 64-bit (recommended for large memory array datasets).',
        'Install hardware drivers: NI-DAQmx, NI-VISA, NI-488.2 (for GPIB), and NI-Serial.',
        'Launch NI MAX (Measurement & Automation Explorer) to configure and self-test your connected DAQ devices and instruments.',
      ],
      pitfallWarning: 'Ensure you install drivers for the matching bitness of your LabVIEW installation (e.g. 64-bit LabVIEW requires 64-bit driver components).',
    },
    shortcuts: [
      { action: 'Switch Front Panel ↔ Block Diagram', keyCombo: 'Ctrl + E', description: 'Toggles between UI and graphical source code instantly.' },
      { action: 'Remove All Broken Wires', keyCombo: 'Ctrl + B', description: 'Deletes every broken (red dashed) wire on the entire block diagram.' },
      { action: 'Automatic Diagram Clean Up', keyCombo: 'Ctrl + U', description: 'Reroutes wires and spaces nodes symmetrically to eliminate diagram clutter.' },
      { action: 'Open Context Help', keyCombo: 'Ctrl + H', description: 'Hover over any VI terminal or node to display its connector pane and terminal names.' },
      { action: 'Find & Replace / Quick Drop', keyCombo: 'Ctrl + Space', description: 'Opens Quick Drop palette to type node names and insert them without browsing palettes.' },
      { action: 'Highlight Execution (Lightbulb)', keyCombo: 'Ctrl + Shift + H', description: 'Toggles animated data tokens flowing across wires during execution.' },
      { action: 'Align & Distribute Objects', keyCombo: 'Ctrl + Shift + A', description: 'Aligns selected Front Panel controls or Block Diagram nodes.' },
    ],
    driverMatrix: [
      { driver: 'NI-DAQmx', status: 'Native Full Support', notes: 'Complete support for USB, PCIe, and PXI multifunction DAQ.' },
      { driver: 'NI-VISA (GPIB/USB/LAN/Serial)', status: 'Native Full Support', notes: 'Universal driver for SCPI instruments (Keysight, Tektronix, Rohde & Schwarz).' },
      { driver: 'NI TestStand', status: 'Native Full Support', notes: 'Industry standard automated test executive.' },
      { driver: 'LabVIEW FPGA', status: 'Native Full Support', notes: 'Compiles graphical code directly into FPGA bitstreams via Xilinx.' },
    ],
    expertTips: [
      'Use NI MAX to create Simulated DAQ Tasks if physical hardware is not yet wired to your PC.',
      'Configure Windows Power Options to "High Performance" to avoid CPU throttling during high-speed streaming.',
    ],
  },
  mac: {
    id: 'mac',
    name: 'Apple macOS (Apple Silicon M1/M2/M3/M4 & Intel)',
    badge: 'Desktop & Portable Pro Lab',
    tagline: 'LabVIEW for macOS, VISA Ethernet/USB, and Parallels Virtualization workflows',
    driverSupport: 'Native LabVIEW environment for macOS; USB-VISA & Ethernet LXI instrumentation; DAQmx available via virtualization.',
    primaryUseCases: [
      'Algorithm development, digital signal processing (DSP), and G-code architectural design on MacBook Pro.',
      'Ethernet/LAN (LXI) and TCPIP instrument control (Keysight, Tektronix scopes, DMMs).',
      'Running Nigel AI prompt engineering and test sequencer architectural validation.',
      'USB-Serial and USB-TMC (Test & Measurement Class) instrument automation.',
    ],
    installationGuide: {
      title: 'Configuring LabVIEW & Instrument Control on macOS',
      steps: [
        'Download LabVIEW for macOS (.dmg installer from National Instruments).',
        'Install NI-VISA for macOS to communicate with USB-TMC and Ethernet LXI instruments.',
        'For NI-DAQmx hardware: Because native DAQmx driver is Windows/Linux only, developers on macOS use Parallels Desktop with Windows 11 ARM (USB pass-through connects NI DAQ devices with zero latency!).',
        'Alternatively, communicate with PXI/cRIO hardware over TCP/IP or network streams from your Mac.',
      ],
      terminalCommands: [
        '# Check connected USB-TMC instruments in macOS Terminal:',
        'system_profiler SPUSBDataType | grep -A 5 -i "National Instruments\\|Keysight\\|Tektronix"',
        '# Test network socket to Ethernet LXI DMM:',
        'nc -zv 192.168.1.100 5025  # SCPI port',
      ],
      pitfallWarning: 'On Apple Silicon (M1/M2/M3/M4), Rosetta 2 or native universal binaries may be required depending on your LabVIEW macOS version. Grant accessibility and screen recording permissions in System Settings.',
    },
    shortcuts: [
      { action: 'Switch Front Panel ↔ Block Diagram', keyCombo: 'Cmd (⌘) + E', description: 'Toggles between UI and graphical source code instantly.' },
      { action: 'Remove All Broken Wires', keyCombo: 'Cmd (⌘) + B', description: 'Deletes every broken (red dashed) wire on the diagram.' },
      { action: 'Automatic Diagram Clean Up', keyCombo: 'Cmd (⌘) + U', description: 'Automatically straightens wires and aligns nodes symmetrically.' },
      { action: 'Open Context Help', keyCombo: 'Cmd (⌘) + H', description: 'Hover over any VI terminal to inspect pinout without opening documentation.' },
      { action: 'Quick Drop Palette', keyCombo: 'Cmd (⌘) + Space', description: 'Type the name of any function or structure and drop onto diagram.' },
      { action: 'Highlight Execution (Lightbulb)', keyCombo: 'Cmd (⌘) + Shift + H', description: 'Toggles animated data tokens across wires.' },
    ],
    driverMatrix: [
      { driver: 'NI-VISA (Ethernet / TCPIP / LXI)', status: 'Native Full Support', notes: 'Flawless SCPI communication with bench instruments over LAN/Wi-Fi.' },
      { driver: 'USB-TMC / Serial Instruments', status: 'Native Full Support', notes: 'Native USB test & measurement communication on macOS.' },
      { driver: 'NI-DAQmx (Multifunction DAQ)', status: 'Requires Virtualization', notes: 'Run via Parallels Desktop with USB pass-through, or deploy to CompactRIO.' },
      { driver: 'Network Streams & WebSockets', status: 'Native Full Support', notes: 'Streams telemetry between Mac and remote Windows/Linux test racks.' },
    ],
    expertTips: [
      'When working on a MacBook, use multi-touch trackpad two-finger pinch to zoom in on complex block diagrams.',
      'Control rack instruments across the lab over Ethernet VISA (e.g. TCPIP0::192.168.1.50::inst0::INSTR) without needing physical USB cables.',
    ],
  },
  linux: {
    id: 'linux',
    name: 'Linux (Ubuntu, RHEL, CentOS & NI Linux Real-Time)',
    badge: 'Enterprise & Real-Time ATE',
    tagline: 'Headless automated test racks, CompactRIO, Docker CI/CD, and NI-DAQmx',
    driverSupport: 'Official NI-DAQmx for Linux, NI-VISA, NI-XNET, and NI Linux Real-Time (embedded).',
    primaryUseCases: [
      'National Instruments CompactRIO (cRIO) and PXI Linux Real-Time embedded controllers.',
      'Automated CI/CD regression test pipelines and Docker containerized test runners.',
      'High-reliability aerospace and defense automated test racks with zero reboot tolerance.',
      'High-throughput DAQmx streaming servers with kernel bypass DMA.',
    ],
    installationGuide: {
      title: 'Installing NI Drivers on Ubuntu / Red Hat Enterprise Linux',
      steps: [
        'Add the National Instruments apt/yum package repository for your Linux distribution.',
        'Update package lists and install the kernel drivers: sudo apt update && sudo apt install ni-daqmx ni-visa.',
        'Run dkms to compile the NI kernel module against your current Linux kernel.',
        'Use the `lsdaq` and `visaconf` command-line utilities to discover hardware.',
      ],
      terminalCommands: [
        '# Add NI repository (Ubuntu example):',
        'sudo dpkg -i ni-ubuntu2204-firstlook.deb',
        'sudo apt-get update',
        'sudo apt-get install -y ni-daqmx ni-visa',
        '# Verify connected DAQmx hardware:',
        'lsdaq',
        '# Query VISA instruments on USB/GPIB/LAN:',
        'visaconf -l',
      ],
      pitfallWarning: 'Ensure Linux Secure Boot is configured to allow signed third-party DKMS kernel modules, or enroll the MOK key when installing NI kernel modules.',
    },
    shortcuts: [
      { action: 'Switch Front Panel ↔ Block Diagram', keyCombo: 'Ctrl + E', description: 'Toggles between UI and graphical source code.' },
      { action: 'Remove All Broken Wires', keyCombo: 'Ctrl + B', description: 'Deletes every broken (red dashed) wire.' },
      { action: 'Automatic Diagram Clean Up', keyCombo: 'Ctrl + U', description: 'Re-aligns diagram nodes and cleans up wire routing.' },
      { action: 'Open Context Help', keyCombo: 'Ctrl + H', description: 'Displays terminal mapping for hovered nodes.' },
      { action: 'Quick Drop Palette', keyCombo: 'Ctrl + Space', description: 'Fast search and drop for any G function.' },
    ],
    driverMatrix: [
      { driver: 'NI-DAQmx for Linux', status: 'Native Full Support', notes: 'Native kernel driver with complete C and LabVIEW API on Ubuntu/RHEL.' },
      { driver: 'NI-VISA for Linux', status: 'Native Full Support', notes: 'Full support for USB-TMC, GPIB, and Ethernet LXI instruments.' },
      { driver: 'NI Linux Real-Time (cRIO/PXI)', status: 'Native Full Support', notes: 'Deterministic RT-PREEMPT Linux kernel powering cRIO and PXI controllers.' },
      { driver: 'Docker CI/CD Test Runners', status: 'Native Full Support', notes: 'Headless compilation and test sequence verification in CI pipelines.' },
    ],
    expertTips: [
      'Run `lsdaq -v` to inspect buffer health, FIFO depth, and terminal pinouts directly from the Linux shell.',
      'Use RT-PREEMPT real-time kernel for microsecond-deterministic test loop cycles on industrial Linux controllers.',
    ],
  },
};
