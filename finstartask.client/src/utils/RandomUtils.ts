export function RandomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function RandomString() {
  return (Math.random() + 1).toString(36).substring(7);
}