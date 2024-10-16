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
      redis = connect_to_redis
      session_key = redis.get(REDIS_KEY)
      redis.close
      session_key == key
    else
      @@session_key == key
    end
  end

  def self.store_session(session_key)
    if use_redis?
      redis = connect_to_redis
      redis.set REDIS_KEY, session_key, ex: 1.hour
      redis.close
    else
      @@session_key = session_key
    end
  end

  private

  def self.use_redis?
    Rails.env.production?
  end

  def self.connect_to_redis
    Redis.new url: ENV["REDIS_URL"], ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE }
  end
end
