import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Owner, CATEGORIES } from '../../types/owner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const INDIAN_STATES_AND_CITIES: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'Kakinada', 'Rajahmundry', 'Anantapur', 'Kurnool', 'Eluru'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Along', 'Tezu', 'Roing', 'Daporijo'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Karimganj', 'North Lakhimpur'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Arrah', 'Begusarai', 'Katihar', 'Munger'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur', 'Dhamtari'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Cuncolim', 'Sanquelim', 'Canacona'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Nadiad'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Rohtak', 'Sonipat', 'Panchkula', 'Yamunanagar'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Bilaspur', 'Hamirpur', 'Una', 'Palampur'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Giridih', 'Ramgarh', 'Phusro', 'Dumka'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum', 'Gulbarga', 'Davangere', 'Bellary', 'Shimoga', 'Tumkur'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Kannur', 'Kottayam', 'Malappuram'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Navi Mumbai'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching', 'Senapati', 'Ukhrul', 'Tamenglong', 'Chandel', 'Jiribam'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Williamnagar', 'Baghmara', 'Resubelpara', 'Nongpoh', 'Mairang', 'Khliehriat'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Saiha', 'Lawngtlai', 'Mamit', 'Saitual', 'Hnahthial'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Mon', 'Phek', 'Kiphire', 'Longleng'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Baripada', 'Bhadrak', 'Jharsuguda'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Pathankot', 'Moga', 'Firozpur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Bhilwara', 'Sikar', 'Sri Ganganagar'],
  'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Rangpo', 'Singtam', 'Jorethang', 'Ravangla', 'Pakyong', 'Soreng'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur', 'Thoothukudi'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Siddipet'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailasahar', 'Ambassa', 'Belonia', 'Khowai', 'Sabroom', 'Sonamura', 'Amarpur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad', 'Meerut', 'Noida', 'Ghaziabad', 'Bareilly', 'Aligarh'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Haldwani', 'Roorkee', 'Kashipur', 'Rudrapur', 'Nainital', 'Mussoorie', 'Pithoragarh'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur'],
  'Delhi': ['New Delhi', 'Delhi'],
  'Chandigarh': ['Chandigarh'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Kathua', 'Udhampur', 'Rajouri', 'Poonch', 'Kupwara'],
  'Ladakh': ['Leh', 'Kargil'],
};

const STATES = Object.keys(INDIAN_STATES_AND_CITIES).sort();

interface OwnerFormProps {
  initialData?: Owner;
  onSubmit: (data: Omit<Owner, 'id' | 'createdAt'>) => void;
}

interface FormData {
  name: string;
  businessName: string;
  category: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  image: string;
  website: string;
  rating: number;
  reviewCount: number;
}

export function OwnerForm({ initialData, onSubmit }: OwnerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: initialData ? {
      name: initialData.name,
      businessName: initialData.businessName,
      category: initialData.category,
      description: initialData.description,
      email: initialData.email,
      phone: initialData.phone,
      address: initialData.address,
      city: initialData.city,
      state: initialData.state,
      zipCode: initialData.zipCode,
      image: initialData.image,
      website: initialData.website || '',
      rating: initialData.rating,
      reviewCount: initialData.reviewCount,
    } : {
      name: '',
      businessName: '',
      category: CATEGORIES[0],
      description: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzAyMjI5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      website: '',
      rating: 4.5,
      reviewCount: 0,
    },
  });

  const category = watch('category');
  const selectedState = watch('state');

  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (selectedState && INDIAN_STATES_AND_CITIES[selectedState]) {
      setCities(INDIAN_STATES_AND_CITIES[selectedState]);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const onFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>

        <div>
          <Label htmlFor="name">Owner Name *</Label>
          <Input
            id="name"
            {...register('name', {
              required: 'Owner name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^\d{10}$/,
                message: 'Phone number must be exactly 10 digits'
              }
            })}
            placeholder="9876543210"
            maxLength={10}
          />
          {errors.phone && (
            <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Business Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Business Information</h3>

        <div>
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            {...register('businessName', {
              required: 'Business name is required',
              minLength: { value: 2, message: 'Business name must be at least 2 characters' }
            })}
            placeholder="ABC Company"
          />
          {errors.businessName && (
            <p className="text-sm text-red-600 mt-1">{errors.businessName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={category}
            onValueChange={(value) => setValue('category', value)}
          >
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 20, message: 'Description must be at least 20 characters' }
            })}
            placeholder="Describe the business..."
            rows={4}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            {...register('website', {
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Website must start with http:// or https://'
              }
            })}
            placeholder="https://example.com"
          />
          {errors.website && (
            <p className="text-sm text-red-600 mt-1">{errors.website.message}</p>
          )}
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Address Information</h3>

        <div>
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            {...register('address', { required: 'Address is required' })}
            placeholder="45 MG Road, Andheri West"
          />
          {errors.address && (
            <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="state">State *</Label>
            <Select
              value={selectedState}
              onValueChange={(value) => {
                setValue('state', value, { shouldValidate: true });
                setValue('city', '', { shouldValidate: false });
              }}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('state', { required: 'State is required' })} />
            {errors.state && (
              <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="city">City *</Label>
            <Select
              value={watch('city')}
              onValueChange={(value) => setValue('city', value, { shouldValidate: true })}
              disabled={!selectedState}
            >
              <SelectTrigger id="city">
                <SelectValue placeholder={selectedState ? "Select city" : "Select state first"} />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('city', { required: 'City is required' })} />
            {errors.city && (
              <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="zipCode">PIN Code *</Label>
          <Input
            id="zipCode"
            {...register('zipCode', {
              required: 'PIN code is required',
              pattern: {
                value: /^\d{6}$/,
                message: 'PIN code must be exactly 6 digits'
              }
            })}
            placeholder="400001"
            maxLength={6}
          />
          {errors.zipCode && (
            <p className="text-sm text-red-600 mt-1">{errors.zipCode.message}</p>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Information</h3>

        <div>
          <Label htmlFor="image">Image URL *</Label>
          <Input
            id="image"
            {...register('image', {
              required: 'Image URL is required',
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Image URL must start with http:// or https://'
              }
            })}
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && (
            <p className="text-sm text-red-600 mt-1">{errors.image.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rating">Rating *</Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              {...register('rating', {
                required: 'Rating is required',
                min: { value: 0, message: 'Rating must be at least 0' },
                max: { value: 5, message: 'Rating cannot exceed 5' },
                valueAsNumber: true
              })}
              placeholder="4.5"
            />
            {errors.rating && (
              <p className="text-sm text-red-600 mt-1">{errors.rating.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="reviewCount">Review Count *</Label>
            <Input
              id="reviewCount"
              type="number"
              min="0"
              {...register('reviewCount', {
                required: 'Review count is required',
                min: { value: 0, message: 'Review count must be at least 0' },
                valueAsNumber: true
              })}
              placeholder="100"
            />
            {errors.reviewCount && (
              <p className="text-sm text-red-600 mt-1">{errors.reviewCount.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1">
          {initialData ? 'Update Owner' : 'Create Owner'}
        </Button>
      </div>
    </form>
  );
}
