require 'bigdecimal'
require 'bigdecimal/util'

module Invoicing
  extend ActiveSupport::Concern

  PRICE_PER_TEAM = BigDecimal("3.00")
  VAT_RATE = BigDecimal("0.255")

  def invoice_number
    10000 + id
  end

  def reference_number
    RFViite.generate invoice_number
  end

  def invoice_date
    end_date.to_date
  end

  def due_date
    invoice_date + 7.days
  end

  def team_count
    teams.length
  end

  def invoice_sum
    team_count * PRICE_PER_TEAM
  end

  def vat_percentage
    0.255
  end

  def price_without_vat
    (invoice_sum / (1 + VAT_RATE)).round(2, :half_up)
  end

  def vat
    invoice_sum - price_without_vat
  end

  def bank_account_number
    return 'FI63 1234 5678 9012 34' if Rails.env.development?
    ENV['BANK_ACCOUNT_NUMBER']
  end
end
