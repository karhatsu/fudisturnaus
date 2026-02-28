module InvoicingHelper
  def format_price(price)
    number_to_currency(price, unit: "€", separator: ",", delimiter: " ", format: "%n %u")
  end

  def format_dates(tournament)
    dates = tournament.dates
    start_date = format_date dates[0]
    return start_date if dates.size == 1
    "#{start_date} - #{format_date dates[-1]}"
  end

  def format_date(date)
    date.to_date.strftime('%d.%m.%Y')
  end
end
