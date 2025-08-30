exports.calculateEMI = ({ principal, annualInterestRate, tenureMonths }) => {
    const monthlyInterestRate = annualInterestRate / 12 / 100;
  
    const emi = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) /
                (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
  
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - principal;
  
    return {
      emi: emi.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2)
    };
  };
  