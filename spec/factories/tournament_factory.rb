FactoryBot.define do
  factory :tournament do
    name { 'Kevätturnaus' }
    start_date { 10.days.from_now }
    location { 'Kurkimäki' }
    match_minutes { 45 }
  end
end
