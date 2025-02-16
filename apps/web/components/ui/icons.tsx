export const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-5 w-5 text-primary-green"
    fill="currentColor"
  >
    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 00.1.42V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
  </svg>
);

export const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-5 w-5 text-primary-green"
    fill="currentColor"
  >
    <path d="M22 5.8a8.49 8.49 0 01-2.36.64 4.13 4.13 0 001.81-2.27 8.21 8.21 0 01-2.61 1 4.1 4.1 0 00-7 3.74 11.64 11.64 0 01-8.45-4.29 4.16 4.16 0 001.27 5.49 4.18 4.18 0 01-1.86-.51v.05a4.11 4.11 0 003.29 4 4.21 4.21 0 01-1.86.07 4.11 4.11 0 003.83 2.84A8.22 8.22 0 012 18.28a11.57 11.57 0 006.29 1.85A11.59 11.59 0 0020 8.45v-.53a8.43 8.43 0 002-2.12z" />
  </svg>
);

export const PersonIcon = ({ className = "h-5 w-5 text-primary-green" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M30 15C34.1421 15 37.5 18.3579 37.5 22.5C37.5 26.6421 34.1421 30 30 30C25.8579 30 22.5 26.6421 22.5 22.5C22.5 18.3579 25.8579 15 30 15Z" />
    <path d="M20 45C20 39.4772 24.4772 35 30 35C35.5228 35 40 39.4772 40 45" />
    <path d="M43.5355 21.4645C45.4882 23.4171 46.6569 26.1435 46.6569 29C46.6569 31.8565 45.4882 34.5829 43.5355 36.5355M16.4645 36.5355C14.5118 34.5829 13.3431 31.8565 13.3431 29C13.3431 26.1435 14.5118 23.4171 16.4645 21.4645" />
  </svg>
);

export const BikeIcon = ({ className = "w-12 h-12", color = "white" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={color}
    className={className}
  >
    <path d="M4 4.5a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1v.5h4.14l.386-1.158A.5.5 0 0 1 11 4h1a.5.5 0 0 1 0 1h-.64l-.311.935.807 1.29a3.5 3.5 0 1 1-.848.53l-.508-.812-2.076 3.322A.5.5 0 0 1 8 10.5H5.959a3.5 3.5 0 1 1-.5 0H4.5v.5h-2a.5.5 0 0 1 0-1h2v-.5H4.5a.5.5 0 0 1-.5-.5zM8.5 9a.5.5 0 0 1 .5.5v.5h1.05l-.212.636a.5.5 0 0 1-.171-.136l-.805-1.288a3.5 3.5 0 1 1 .779-.49l.226.361L10.413 8H9.5a.5.5 0 0 1-.5-.5V7h-1c-.003 0-.006 0-.007-.001A.498.498 0 0 1 8 7c0 .271.132.512.335.656.203.144.469.196.729.196h.341a3.5 3.5 0 0 1-.573-1H8.5zm2.5 3.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0zm1.5-3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm-7 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
  </svg>
);

// Land Governance Icon (Palm Tree)
export const LandGovernanceIcon = ({
  className = "w-12 h-12",
  color = "white",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" />
    <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3" />
    <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35" />
    <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" />
  </svg>
);

// Sustainable Agriculture Icon (Vegan)
export const SustainableAgricultureIcon = ({
  className = "w-12 h-12",
  color = "white",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8q6 0 6-6-6 0-6 6" />
    <path d="M17.41 3.59a10 10 0 1 0 3 3" />
    <path d="M2 2a26.6 26.6 0 0 1 10 20c.9-6.82 1.5-9.5 4-14" />
  </svg>
);

// Climate Adaptation Icon (Wind and Water with Arrows)
export const ClimateAdaptationIcon = ({
  className = "w-12 h-12",
  color = "white",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={color}
    className={className}
  >
    <path d="M20 14h2v2h-2c-1.38 0-2.74-.35-4-1c-2.5 1.3-5.5 1.3-8 0c-1.26.65-2.63 1-4 1H2v-2h2c1.39 0 2.78-.47 4-1.33c2.44 1.71 5.56 1.71 8 0c1.22.86 2.61 1.33 4 1.33m0 6h2v2h-2c-1.38 0-2.74-.35-4-1c-2.5 1.3-5.5 1.3-8 0c-1.26.65-2.63 1-4 1H2v-2h2c1.39 0 2.78-.47 4-1.33c2.44 1.71 5.56 1.71 8 0c1.22.86 2.61 1.33 4 1.33M7 2L3 6h3v5h2V6h3m6-4l-4 4h3v5h2V6h3" />
  </svg>
);

export const TechnologyIcon = ({
  className = "w-12 h-12",
  color = "currentColor",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
  >
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    >
      <path d="m5 16l5-3m4-2l5-3m-7-3v5m0 4v5M5 8l5 3m4 2l5 3m1.5-7v5.5m-7 6l5.5-3m-14.5 0l6 3m-7-5.5V9m1-2.5l6-3m9 3l-6-3" />
      <circle cx="12" cy="3.5" r="1.5" />
      <circle cx="12" cy="20.5" r="1.5" />
      <circle cx="3.5" cy="7.5" r="1.5" />
      <circle cx="20.5" cy="7.5" r="1.5" />
      <circle cx="20.5" cy="16.5" r="1.5" />
      <circle cx="3.5" cy="16.5" r="1.5" />
      <path d="m12 9.75l2 1.125v2.25l-2 1.125l-2-1.125v-2.25z" />
    </g>
  </svg>
);
