FactoryBot.define do
  factory :tournament do
    name { 'Kevätturnaus' }
    start_date { 10.days.from_now }
    location { 'Kurkimäki' }
  end
end
