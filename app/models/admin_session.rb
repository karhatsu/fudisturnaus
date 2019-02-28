require 'redis'
require 'securerandom'

REDIS_KEY = 'admin-session'

class AdminSession
  def self.create(username, password)
    return nil unless username == ENV['ADMIN_USERNAME'] && password == ENV['ADMIN_PASSWORD']
    session_key = SecureRandom.hex
    store_session session_key
    session_key
  end

  def self.find_by_key(key)
    return false if key.blank?
    if use_redis?
      !!Redis.new.get(REDIS_KEY)
    else
      !!@@session_key
    end
  end

  def self.store_session(session_key)
    if use_redis?
      Redis.new.set REDIS_KEY, session_key, ex: 1.hour
    else
      @@session_key = session_key
    end
  end

  def self.use_redis?
    Rails.env.production?
  end
end
