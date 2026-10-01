UPDATE insights_translations 
SET content = REPLACE(
  content,
  'This stage helps evaluate whether your startup idea addresses a real, recurring problem.</p>

<h3>2. Conduct Problem Interviews Without Selling</h3>',
  'This stage helps evaluate whether your startup idea addresses a real, recurring problem.</p>

<figure style="margin: 2rem 0;"><img src="/images/insights/clicks-vs-payments-validation.png" alt="Clicks vs Payments – illustrating that clicks measure interest while payments measure real commitment" style="width:100%; border-radius: 8px;" /></figure>

<h3>2. Conduct Problem Interviews Without Selling</h3>'
)
WHERE id = '1043c717-1d0b-4032-912e-8594f182ec54';