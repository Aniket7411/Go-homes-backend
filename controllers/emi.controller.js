exports.calculateEMI = (req, res) => {
    const { principal, annualInterestRate, tenureMonths } = req.body;
  
    // Basic validation
    if (
      typeof principal !== 'number' || principal <= 0 ||
      typeof annualInterestRate !== 'number' || annualInterestRate <= 0 ||
      typeof tenureMonths !== 'number' || tenureMonths <= 0 || !Number.isInteger(tenureMonths)
    ) {
      return res.status(400).json({
        message: 'Invalid input. Please provide positive values for principal, annualInterestRate, and integer value for tenureMonths.'
      });
    }
  
    try {
      const monthlyInterestRate = annualInterestRate / 12 / 100;
  
      const emi = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) /
                  (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
  
      const totalPayment = emi * tenureMonths;
      const totalInterest = totalPayment - principal;
  
      res.json({
        emi: emi.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
        totalInterest: totalInterest.toFixed(2)
      });
  
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  };
  